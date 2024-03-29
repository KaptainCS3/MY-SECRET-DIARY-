import { useNavigate } from "react-router-dom";
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
import { db, storage, auth } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAppDispatch } from "../hooks/hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BeatLoader, ClipLoader } from "react-spinners";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
// Define Maybe and AnyPresentValue types

type Maybe<T> = T | undefined | null;
type AnyPresentValue = Exclude<Yup.AnyObject, undefined | null>;
interface FormValues {
  category: string;
  description: string;
  image: File | null;
  isPublic: boolean;
  createdAt: object | null | Date;
  updatedAt: object | null | Date;
  startDate: object | null | Date | string | number;
  endDate: object | null | Date | string | number;
  userID: string;
}
interface User {
  uid: string;
}
const FormEntry = () => {
  const user = auth.currentUser as User | null;
  const default_url = import.meta.env.VITE_DEFAULT_IMAGE;
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(default_url);
  const [uploadingDiary, setUploadingDiary] = useState<boolean>(false);
  const [categoryOption, setCategoryOption] = useState<object>([]);
  const [upload, setUpload] = useState<string>("");
  const [uploadState, setUploadState] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const currentDate = new Date();
  const mm = currentDate.getMonth();
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthsOfYear[mm];
  const year = currentDate.getFullYear();
  const day = currentDate.getDate();
  const formik = useFormik<FormValues>({
    initialValues: {
      category: "",
      description: "",
      image: null,
      isPublic: false,
      createdAt: null,
      updatedAt: null,
      startDate: null,
      endDate: null,
      userID: "",
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
    }).shape({
      startDate: Yup.date().min(
        new Date(),
        `Start date must be later than ${month} ${day}, ${year}`
      ),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), `End date must be after today`)
        .test(
          "is-after-start-date",
          `End date must be greater than or equal to start date`,
          function (value) {
            const { startDate } = this.parent;
            return !startDate || !value || value >= startDate;
          }
        ),
    }),

    onSubmit: async (
      { category, description, image, isPublic, updatedAt, startDate, endDate },
      { setSubmitting }
    ) => {
      try {
        let imageUrl = null;
        if (image) {
          const storageRef = ref(
            storage,
            `diary/images/${image?.name}${uuidv4()}`
          );
          const uploadTask = uploadBytesResumable(storageRef, image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // handle upload progress // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              setUpload(`Upload is ${progress} % done`);
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  setUploadState("Upload is running");
                  setUploadingDiary(true);
                  break;
              }
            },
            (error) => {
              throw new Error(`Error uploading image: ${error}`);
            },
            async () => {
              imageUrl = await getDownloadURL(storageRef);
              let start, end;
              if (startDate === null) {
                return;
              } else {
                start = new Date(startDate as string | number);
              }
              if (end === null) {
                return;
              } else {
                end = new Date(endDate as string | number);
              }
              const newDiaryEntry = {
                id: uuidv4(),
                category,
                description,
                image: imageUrl,
                isPublic,
                createdAt: serverTimestamp(), // Use server timestamp for createdAt
                updatedAt, // Use server timestamp for createdAt
                startDate: start,
                endDate: end,
                userID: user?.uid,
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
          let start, end;
          if (startDate === null) {
            return;
          } else {
            start = new Date(startDate as string | number);
          }
          if (end === null) {
            return;
          } else {
            end = new Date(endDate as string | number);
          }
          const newDiaryEntry = {
            id: uuidv4(),
            category,
            description,
            image: imageUrl,
            isPublic,
            createdAt: serverTimestamp(), // Use server timestamp for createdAt
            updatedAt, // Use server timestamp for createdAt
            startDate: start,
            endDate: end,
            userID: user?.uid,
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
      setFetching(false);
    } catch (error) {
      console.error("Error getting diary entries: ", error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  if (formik.isSubmitting === undefined) {
    formik.isSubmitting = false;
  }
  return (
    <>
      <section className="animate">
        <form className="form" onSubmit={formik.handleSubmit}>
          <div className="bg-[#fff] sm:w-full">
            {/* {type === "select" ? } */}
            <div className={`flex flex-col mb-4 relative`}>
              <label htmlFor="category" className="py-2 cursor-pointer">
                Category
              </label>
              <select
                {...formik.getFieldProps("category")}
                id="category"
                className="appearance-none custom-select py-[0.6rem] px-4 border outline-none border-black rounded-[0.25rem] italic text-partial"
                disabled={fetching}
              >
                {Array.isArray(categoryOption) &&
                  categoryOption?.map((el: string, index: number) => {
                    return (
                      <option
                        className="text-black"
                        value={el === "-- Choose category --" ? "" : el}
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
              {fetching && (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    formik.errors.category && formik.touched.category
                      ? "mt-2"
                      : "mt-11"
                  }`}
                >
                  <BeatLoader color="#63004F" speedMultiplier={0.6} />
                </div>
              )}

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
              <div className="mt-2 relative flex flex-col py-12 border-dashed border-2 rounded-xl border-black">
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="py-[0.6rem] px-4 border outline-none rounded-xl"
                  hidden
                  // ?event handle for file change input
                  onChange={handleImageChange}
                />
                {/*  justify-between w-full flex-col  py-5 */}
                <div className="flex items-center flex-col overflow-hidden text-main">
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="text-[3rem] pb-16"
                  />
                  <label
                    htmlFor="image"
                    className="pt-6 cursor-pointer text-xl w-full justify-center items-center flex absolute h-full overflow-hidden top-0"
                  >
                    Browse Image to Upload
                  </label>
                  {upload && uploadState && (
                    <div className="flex flex-col absolute bottom-2 items-center">
                      <small className="text-main text-sm">{upload}</small>
                      <small className="text-main text-sm">{uploadState}</small>
                      <ClipLoader
                        color="#63004F"
                        speedMultiplier={0.6}
                        size={24}
                      />
                    </div>
                  )}
                </div>
              </div>
              {imageUrl ? (
                <div className="max-w-full h-[150px] mt-5">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              ) : null}
              {formik.touched.image && formik.errors.image ? (
                <ErrorMSG error_value={formik.errors.image} />
              ) : null}
            </div>
            {/* Start Date input field */}
            <div className={`flex flex-col mb-4 w-full`}>
              <label htmlFor="sdate" className="py-2 cursor-pointer">
                Start Date
              </label>
              <input
                {...formik.getFieldProps("startDate")}
                id="sdate"
                type="date"
                placeholder="Enter description here"
                className="w-full py-[0.6rem] px-4 border outline-none resize-none border-black rounded-[0.25rem] placeholder:italic placeholder:text-partial"
              />
              {formik.touched.startDate && formik.errors.startDate ? (
                <ErrorMSG error_value={formik.errors.startDate} />
              ) : null}
            </div>

            {/* End Date input field */}
            <div className={`flex flex-col mb-4 w-full`}>
              <label htmlFor="edate" className="py-2 cursor-pointer">
                End Date
              </label>
              <input
                {...formik.getFieldProps("endDate")}
                id="edate"
                type="date"
                placeholder="Enter description here"
                className="w-full py-[0.6rem] px-4 border outline-none resize-none border-black rounded-[0.25rem] placeholder:italic placeholder:text-partial"
              />
              {formik.touched.endDate && formik.errors.endDate ? (
                <ErrorMSG error_value={formik.errors.endDate} />
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
              disabled={formik.isSubmitting || uploadingDiary} // apply disabled attribute
              styleProps="my-8 border px-4 py-3 rounded-md text-sm font-bold w-full bg-black text-white"
            />
          </div>
        </form>
      </section>
    </>
  );
};

export default FormEntry;
