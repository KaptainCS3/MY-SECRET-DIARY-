import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import ErrorMSG from "./ErrorMSG";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { useAppDispatch } from "../hooks/hook";
import { diaryListItems } from "../features/DiaryList";

interface FormValues {
  diarySearch: string;
  category: string;
}
interface User {
  uid: string;
}

const SearchDiary = () => {
  const user = auth.currentUser as User | null;
  const dispatch = useAppDispatch();
  const [fetching, setFetching] = useState<boolean>(true);
  const [categoryOption, setCategoryOption] = useState<object>([]);
  const formik = useFormik<FormValues>({
    initialValues: {
      diarySearch: "",
      category: "",
    },
    validationSchema: Yup.object({
      diarySearch: Yup.string().required("Required"),
    }),
    onSubmit: ({ diarySearch }) => {
      console.log(diarySearch);
    },
  });

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

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      const ref = collection(db, "diary");
      const userID = user?.uid;
      if (!userID) {
        throw new Error("User ID is undefined");
      }
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
    fetchDiaryEntries();
  }, [formik.values.category]);

  console.log(fetching);

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
            <select
              {...formik.getFieldProps("category")}
              id="category"
              className="w-full cursor-pointer appearance-none custom py-[0.6rem] px-4 outline-none italic"
            >
              {Array.isArray(categoryOption) &&
                categoryOption?.map((el: string) => {
                  return (
                    <option value={el} key={el}>
                      {el}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        <div className="">
          {formik.errors.diarySearch && formik.touched.diarySearch ? (
            <ErrorMSG error_value={formik.errors.diarySearch} />
          ) : null}
        </div>
      </form>
    </section>
  );
};

export default SearchDiary;
