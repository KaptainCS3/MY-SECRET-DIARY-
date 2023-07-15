import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useFormik } from "formik";
import Button from "./Button";
import ErrorMSG from "./ErrorMSG";
import * as Yup from "yup";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

// Define Maybe and AnyPresentValue types
type Maybe<T> = T | undefined | null;
type AnyPresentValue = Exclude<Yup.AnyObject, undefined | null>;

const FormEntry = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const formik = useFormik({
    initialValues: {
      category: "",
      description: "",
      image: null,
      isPublic: true,
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
    onSubmit: async ({ category, description, image, isPublic }) => {
      try {
        const diaryData = await addDoc(collection(db, "diary"), {
          category: category,
          description: description,
          image: image,
          isPublic: isPublic,
        });
        console.log("Document written with ID: ", diaryData.id);
      } catch (error) {
        console.error(error);
      }
      formik.resetForm();
      navigate("/dashboard");
      //!toast message after redirect
      toast.success("Diary entry saved successfully");
    },
  });

  //! onChange event handler function and preview state
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
      setImageUrl(URL.createObjectURL(file));
    } else {
      formik.setFieldValue("image", null);
      setImageUrl("");
    }
  };
  console.log(formik.values);
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
                <option value="">-- choose category --</option>
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
                <option value="academy diary">Wedding Diary</option>
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
              ) : null}
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
              styleProps="my-8 border px-4 py-3 rounded-md text-sm font-bold w-full"
            />
          </div>
        </form>
      </section>
    </>
  );
};

export default FormEntry;
