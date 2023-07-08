import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import ErrorMSG from "./ErrorMSG";
// interface FormValues {
//   diarySearch: string;
// }
const SearchDiary = () => {
  const formik = useFormik({
    initialValues: {
      diarySearch: "",
    },
    validationSchema: Yup.object({
      diarySearch: Yup.string().required("Required"),
    }),
    onSubmit: ({ diarySearch }) => {
      alert(JSON.stringify(diarySearch, null, 2));
      // formik.resetForm();
    },
  });

  return (
    <section>
      <form className="" onSubmit={formik.handleSubmit}>
        <div className="flex items-center justify-between mt-7">
          <div className="border-b border-black bg-white w-[80%] flex justify-between items-center">
            <input
              type="text"
              placeholder="Type here to search"
              {...formik.getFieldProps("diarySearch")}
              className="bg-transparent outline-none w-[80%] placeholder:italic placeholder:text-black"
            />
            <button type="submit" className="p-3 pb-2 pr-3 cursor-pointer">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <div className="w-[14%] border-b border-black flex justify-center items-center">
            <button
              type="button"
              className="p-3 pb-[0.5rem] pr-2 cursor-pointer"
            >
              <img src="/assets/filter.png" alt="" />
            </button>
          </div>
        </div>
        <div className="">
          {formik.errors.diarySearch ? (
            <ErrorMSG error_value={formik.errors.diarySearch} />
          ) : null}
        </div>
      </form>
    </section>
  );
};

export default SearchDiary;
