import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { useAppDispatch } from "../hooks/hook";
import { diaryListItems } from "../features/DiaryList";
import { BeatLoader } from "react-spinners";
import Button from "./Button";
import ErrorMSG from "./ErrorMSG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface FormValues {
  category: string;
  startDate: Date | null;
  endDate: Date | null;
}
interface toggleShow {
  hideCat: () => void;
}
interface User {
  uid: string;
}

const FilterPanel = ({ hideCat }: toggleShow) => {
  const user = auth.currentUser as User | null;
  const dispatch = useAppDispatch();
  const [fetching, setFetching] = useState<boolean>(true);
  const [categoryOption, setCategoryOption] = useState<object>([]);
  const formik = useFormik<FormValues>({
    initialValues: {
      startDate: null,
      endDate: null,
      category: "",
    },
    validationSchema: Yup.object().shape({
      startDate: Yup.date()
        .min(new Date("2023-01-01"), "Start date must be after January 1, 2023")
        .test(
          "is-after-start-date",
          "End date must be greater than or equal to start date",
          function (value) {
            const { startDate } = this.parent;
            return !startDate || !value || value >= startDate;
          }
        ),
    }),
    onSubmit: () => {},
  });

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

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      const ref = collection(db, "diary");
      if (!user) {
        throw new Error("User ID is undefined");
      }
      const userID = user?.uid;
      const userEntriesQuery = query(
        ref,
        where("userID", "==", userID),
        where("category", "==", formik.values.category), // filter by category
        orderBy("userID"),
        orderBy("createdDate", "desc")
      );

      const publicEntriesQuery = query(
        ref,
        where("isPublic", "==", true),
        where("userID", "!=", userID),
        where("category", "==", formik.values.category), // filter by category
        orderBy("userID"),
        orderBy("createdDate", "desc")
      );
      try {
        const [userEntriesSnapshot, publicEntriesSnapshot] = await Promise.all([
          getDocs(userEntriesQuery),
          getDocs(publicEntriesQuery),
        ]);

        const userEntries = userEntriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdDate = data.createdDate.toDate();
          return {
            id: doc.id,
            image: data.image,
            category: data.category,
            description: data.description,
            isPublic: data.isPublic,
            createdDate,
            userID: data.userID,
          };
        });
        console.log("user's entries :", userEntries);

        const publicEntries = publicEntriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdDate = data.createdDate.toDate();
          return {
            id: doc.id,
            image: data.image,
            category: data.category,
            description: data.description,
            isPublic: data.isPublic,
            createdDate,
            userID: data.userID,
          };
        });
        console.log("public entries :", publicEntries);
        const diaryEntries = [...userEntries, ...publicEntries];
        dispatch(diaryListItems(diaryEntries));
        setFetching(false);
      } catch (error) {
        console.error("Error getting diary entries: ", error);
      }
    };
    if (user) {
      fetchDiaryEntries();
    }
  }, [formik.values.category]);

  useEffect(() => {
    console.log("useEffect is running");
    const myDiary = async () => {
      const ref = collection(db, "diary");
      if (!user) {
        throw new Error("User ID is undefined");
      }
      const userID = user.uid;
      const userEntriesQuery = query(
        ref,
        where("userID", "==", userID),
        orderBy("userID"),
        orderBy("createdDate", "desc")
      );

      const publicEntriesQuery = query(
        ref,
        where("isPublic", "==", true),
        where("userID", "!=", userID),
        orderBy("userID"),
        orderBy("createdDate", "desc")
      );

      try {
        const [userEntriesSnapshot, publicEntriesSnapshot] = await Promise.all([
          getDocs(userEntriesQuery),
          getDocs(publicEntriesQuery),
        ]);

        const userEntries = userEntriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdDate = data.createdDate.toDate();
          return {
            id: doc.id,
            image: data.image,
            category: data.category,
            description: data.description,
            isPublic: data.isPublic,
            createdDate,
            userID: data.userID,
          };
        });

        const publicEntries = publicEntriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdDate = data.createdDate.toDate();
          return {
            id: doc.id,
            image: data.image,
            category: data.category,
            description: data.description,
            isPublic: data.isPublic,
            createdDate,
            userID: data.userID,
          };
        });

        const diaryEntries = [...userEntries, ...publicEntries];
        console.log(diaryEntries);
        dispatch(diaryListItems(diaryEntries));
        setFetching(false);
      } catch (error) {
        console.error("Error getting diary entries: ", error);
      }
    };
    if (user) {
      myDiary();
    }
  }, [formik.values.category === "All"]);

  console.log(formik.values);

  return (
    <>
      <section className="success_modal animate">
        <div className="bg-white min-h-full w-3/4 float-right">
          <div className="bg-black py-[1.4rem] px-4 font-bold border-white">
            <div className="flex justify-between">
              <h1 className="text-white dark:text-black text-xl">Filter</h1>
              <FontAwesomeIcon
                icon={faXmark}
                className="text-white text-2xl cursor-pointer"
                onClick={hideCat}
              />
            </div>
          </div>
          <div className="px-4 py-8">
            <h2 className="text-xl font-bold">Filter your diary entries</h2>
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
                        value={el === "-- Choose category --" ? "All" : el}
                        key={index}
                      >
                        {el === "-- Choose category --" ? "All" : el}
                      </option>
                    );
                  })}
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
            <form>
              <div className={`flex flex-col mb-4 w-full`}>
                <label htmlFor="sdate" className="py-2 cursor-pointer">
                  Start Date
                </label>
                <input
                  {...formik.getFieldProps("startDate")}
                  id="sdate"
                  type="date"
                  placeholder="Enter description here"
                  className="py-[0.6rem] px-4 border outline-none resize-none border-black rounded-[0.25rem] placeholder:italic placeholder:text-partial"
                />
                {/* {formik.touched.description && formik.errors.description ? (
              <ErrorMSG error_value={formik.errors.description} />
            ) : null} */}
              </div>
              <div className={`flex flex-col mb-4 w-full`}>
                <label htmlFor="edate" className="py-2 cursor-pointer">
                  End Date
                </label>
                <input
                  {...formik.getFieldProps("endDate")}
                  id="edate"
                  type="date"
                  placeholder="Enter description here"
                  className="py-[0.6rem] px-4 border outline-none resize-none border-black rounded-[0.25rem] placeholder:italic placeholder:text-partial"
                />
                {/* {formik.touched.description && formik.errors.description ? (
              <ErrorMSG error_value={formik.errors.description} />
          ) : null} */}
              </div>
              <Button
                actionBtn={formik.handleSubmit}
                type="submit"
                textContent="Filter"
                disabled={formik.isSubmitting} // apply disabled attribute
                styleProps="my-8 border px-4 py-3 rounded-md text-sm font-bold w-full bg-black text-white"
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default FilterPanel;
