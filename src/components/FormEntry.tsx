import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "../hooks/hook";
// import { RootState } from "../app/store";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import Button from "./Button";
import ErrorMSG from "./ErrorMSG";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { addDiaryEntry } from "../features/DiarySlice";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAppDispatch } from "../hooks/hook";
// Define Maybe and AnyPresentValue types
type Maybe<T> = T | undefined | null;
type AnyPresentValue = Exclude<Yup.AnyObject, undefined | null>;
interface FormValues {
  category: string;
  description: string;
  image: File | null;
  isPublic: boolean;
  createdDate: object | null | Date;
}
const FormEntry = () => {
  const default_url = import.meta.env.VITE_DEFAULT_IMAGE;
  // const user = useAppSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(default_url);
  const [categoryOption, setCategoryOption] = useState<object>([]);
  const dispatch = useAppDispatch();
  const formik = useFormik<FormValues>({
    initialValues: {
      category: "",
      description: "",
      image: null,
      isPublic: true,
      createdDate: null,
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Required"),
      description: Yup.string()
        .min(20, "description too short")
        // .max(1000, "description too long")
        .required("Required"),
      image: Yup.mixed()
        .notRequired()
        .test(
          "fileType",
          "Invalid file type",
          (value: Maybe<AnyPresentValue>) => {
            if (!value) return true; //! Skip validation if no file was uploaded
            if (value instanceof File) {
              return ["image/jpeg", "image/png"].includes(value.type);
            }
            return false;
          }
        )
        .test(
          "fileSize",
          "File size must be less than 1MB.",
          (value: Maybe<AnyPresentValue>) => {
            if (!value) return true; //! Skip validation if no file was uploaded
            if (value instanceof File) {
              const maxSize = 1024 * 1024; // 1MB
              return value.size <= maxSize;
            }
            return false;
          }
        ),
    }),
    onSubmit: async (
      { category, description, image, isPublic },
      { setSubmitting }
    ) => {
      try {
        let imageUrl = null;
        if (image) {
          const storageRef = ref(storage, `diary/images/${image?.name}`);
          const uploadTask = uploadBytesResumable(storageRef, image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // handle upload progress // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              throw new Error(`Error uploading image: ${error}`);
            },
            async () => {
              imageUrl = await getDownloadURL(storageRef);
              const newDiaryEntry = {
                id: uuidv4(),
                category,
                description,
                image: imageUrl,
                isPublic,
                createdDate: serverTimestamp(), // Use server timestamp for createdDate
              };
              dispatch(addDiaryEntry([newDiaryEntry]));
              const diaryData = await addDoc(
                collection(db, "diary"),
                newDiaryEntry
              );
              console.log("Document written with ID: ", diaryData.id);
              setSubmitting(false);
              formik.resetForm();
              navigate("/journals");
              toast.success("Diary entry saved successfully");
            }
          );
        } else {
          const storageRef = ref(storage, `default/image/default_diary.png`);
          imageUrl = await getDownloadURL(storageRef);
          const newDiaryEntry = {
            id: uuidv4(),
            category,
            description,
            image: imageUrl,
            isPublic,
            createdDate: serverTimestamp(), // Use server timestamp for createdDate
          };
          dispatch(addDiaryEntry([newDiaryEntry]));
          const diaryData = await addDoc(
            collection(db, "diary"),
            newDiaryEntry
          );
          console.log("Document written with ID: ", diaryData.id);
          setSubmitting(false);
          formik.resetForm();
          navigate("/journals");
          toast.success("diary entry saved successfully");
        }
      } catch (error) {
        toast.error("An error occurred while saving the diary entry");
        console.log("error");
      }
    },
  });

  //! onChange event handler function and preview state
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
      setImageUrl(URL.createObjectURL(file));
    } else {
      formik.setFieldValue("image", imageUrl);
      setImageUrl("");
    }
  };

  const getCategory = async () => {
    const option = collection(db, "category");
    try {
      const querySnapshot = await getDocs(option);
      const optionList = querySnapshot.docs.map((doc) => doc.data());
      setCategoryOption(optionList[0]["options"]);
    } catch (error) {
      console.error("Error getting diary entries: ", error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      <section className="">
        <form className="form" onSubmit={formik.handleSubmit}>
          <div className="bg-[#fff] sm:w-full">
            {/* {type === "select" ? } */}
            <div className={`flex flex-col mb-4`}>
              <label htmlFor="category" className="py-2 cursor-pointer">
                Category
              </label>
              <select
                {...formik.getFieldProps("category")}
                id="category"
                className="appearance-none custom-select py-[0.6rem] px-4 border outline-none border-black rounded-[0.25rem] italic"
              >
                {Array.isArray(categoryOption) &&
                  categoryOption?.map((el: string, index: number) => {
                    return (
                      <option
                        value={el === "-- choose category --" ? "" : el}
                        key={index}
                      >
                        {el}
                      </option>
                    );
                  })}
                {/* <option value="">-- choose category --</option>
                <option value="academy diary">Academy Diary</option>
                <option value="audio diary" disabled>
                  Audio Diary
                </option>
                <option value="creative writing diary">
                  Creative Writing Diary
                </option>
                <option value="dream diary">Dream Diary</option>
                <option value="fitness diary">Fitness Diary</option>
                <option value="food / diet diary">Food / Diet Diary</option>
                <option value="gratitude diary">Gratitude Diary</option>
                <option value="health diary">Health Diary</option>
                <option value="morning pages">Morning Pages</option>
                <option value="pregnancy diary">Pregnancy Diary</option>
                <option value="reflection diary">Reflection Diary</option>
                <option value="religious diary">Religious Diary</option>
                <option value="secret diary">Secret Diary</option>
                <option value="travel diary">Travel Diary</option>
                <option value="academy diary">Wedding Diary</option> */}
              </select>
              {formik.touched.category &&
              formik.errors.category &&
              formik.values.category === "" ? (
                <ErrorMSG error_value={formik.errors.category} />
              ) : null}
            </div>

            {/* {type === "textarea" } */}
            <div className={`flex flex-col mb-4`}>
              <label htmlFor="description" className="py-2 cursor-pointer">
                Description
              </label>
              <textarea
                {...formik.getFieldProps("description")}
                id="description"
                placeholder="Enter description here"
                className="py-[0.6rem] pb-16 px-4 border outline-none resize-none border-black rounded-[0.25rem] placeholder:italic placeholder:text-partial"
              />
              {formik.touched.description && formik.errors.description ? (
                <ErrorMSG error_value={formik.errors.description} />
              ) : null}
            </div>

            {/* {type === "file" } */}
            <div className={`flex flex-col mb-4`}>
              <label htmlFor="image" className="py-2 cursor-pointer">
                Upload image (optional)
              </label>
              <input
                type="file"
                id="image"
                className=""
                name="image"
                hidden
                // !event handle for file change input
                onChange={handleImageChange}
              />
              {imageUrl ? (
                <div className="max-w-full h-[150px] mt-5">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-md"
                    // style={{
                    //   height: "200px",
                    //   width: "200px",
                    //   backgroundSize: "cover",
                    //   backgroundPosition: "center",
                    //   display: 'flex',
                    // }}
                  />
                </div>
              ) : (
                <div className="max-w-full h-[150px] mt-5">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-md"
                    // style={{
                    //   height: "200px",
                    //   width: "200px",
                    //   backgroundSize: "cover",
                    //   backgroundPosition: "center",
                    //   display: "flex",
                    // }}
                  />
                </div>
              )}
              {formik.touched.image && formik.errors.image ? (
                <ErrorMSG error_value={formik.errors.image} />
              ) : null}
            </div>

            {/* {type === "checkbox" } */}
            <div className={`flex`}>
              <input
                type="checkbox"
                id="isPublic"
                className=""
                checked={formik.values.isPublic}
                {...formik.getFieldProps("isPublic")}
              />
              <label htmlFor="isPublic" className="pl-4 cursor-pointer text-sm">
                Is entry public?
              </label>
              {formik.touched.isPublic && formik.errors.isPublic ? (
                <ErrorMSG error_value={formik.errors.isPublic} />
              ) : null}
            </div>

            {/* submit button make use of reusable component */}
            <Button
              actionBtn={formik.handleSubmit}
              type="submit"
              textContent="Save"
              // disabled={formik.isSubmitting} // apply disabled attribute
              styleProps="my-8 border px-4 py-3 rounded-md text-sm font-bold w-full"
            />
          </div>
        </form>
      </section>
    </>
  );
};

export default FormEntry;
