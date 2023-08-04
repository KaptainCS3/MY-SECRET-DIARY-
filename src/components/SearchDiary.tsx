import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import ErrorMSG from "./ErrorMSG";
import FilterPanel from "./FilterPanel";
import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { diaryListItems } from "../features/DiaryList";
import { RootState } from "../app/store";

interface FormValues {
  diarySearch: string;
}
interface User {
  uid: string;
}

const SearchDiary = () => {
  const user = auth.currentUser as User | null;
  const diaryEntry = useAppSelector((state: RootState) => state.diaryList.list);
  const [fetching, setFetching] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const formik = useFormik<FormValues>({
    initialValues: {
      diarySearch: "",
    },
    validationSchema: Yup.object({
      diarySearch: Yup.string().required("Required"),
    }),
    onSubmit: ({ diarySearch }) => {
      const diaryFilter = diaryEntry.filter((items) => {
        return items.description
          .toLowerCase()
          .includes(diarySearch.toLowerCase());
      });
      console.log(diaryFilter);
      console.log(fetching)

      dispatch(diaryListItems(diaryFilter));
    },
  });


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
        orderBy("createdAt", "desc")
      );

      const publicEntriesQuery = query(
        ref,
        where("isPublic", "==", true),
        where("userID", "!=", userID),
        orderBy("userID"),
        orderBy("createdAt", "desc")
      );

      try {
        const [userEntriesSnapshot, publicEntriesSnapshot] = await Promise.all([
          getDocs(userEntriesQuery),
          getDocs(publicEntriesQuery),
        ]);

        const userEntries = userEntriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt.toDate();
          return {
            id: doc.id,
            image: data.image,
            category: data.category,
            description: data.description,
            isPublic: data.isPublic,
            createdAt,
            userID: data.userID,
          };
        });

        const publicEntries = publicEntriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt.toDate();
          return {
            id: doc.id,
            image: data.image,
            category: data.category,
            description: data.description,
            isPublic: data.isPublic,
            createdAt,
            userID: data.userID,
          };
        });

        const diaryEntries = [...userEntries, ...publicEntries];
        dispatch(diaryListItems(diaryEntries));
        setFetching(false);
      } catch (error) {
        console.error("Error getting diary entries: ", error);
      }
    };
    if (user) {
      myDiary();
    }
  }, [formik.values.diarySearch === ""]);

  useEffect(() => {
    const handleFilter = () => {
      const diaryFilter = diaryEntry.filter((items) => {
        return items.description
          .toLowerCase()
          .includes(formik.values.diarySearch.toLowerCase());
      });
      dispatch(diaryListItems(diaryFilter));
    };
    handleFilter();
  }, [formik.values.diarySearch != ""]);
  const showCat = () => {
    setShowPanel(true);
  };
  const hideCat = () => {
    setShowPanel(false);
  };

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
          <div className="w-[14%] border-b border-black pt-3 pb-2">
            <span
              className="w-full cursor-pointer appearance-none custom py-[0.6rem] px-4 outline-none"
              onClick={showCat}
            ></span>
          </div>
        </div>
        <div className="">
          {formik.errors.diarySearch && formik.touched.diarySearch ? (
            <ErrorMSG error_value={formik.errors.diarySearch} />
          ) : null}
        </div>
        {showPanel ? <FilterPanel hideCat={hideCat} /> : null}
      </form>
    </section>
  );
};

export default SearchDiary;
