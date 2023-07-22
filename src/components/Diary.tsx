import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { useState, useEffect } from "react";
import Skeleton from "./Skeleton";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { diaryListItems } from "../features/DiaryList";
import { RootState } from "../app/store";
import { SyncLoader } from "react-spinners";

interface User {
  uid: string;
}
const Diary = () => {
  const user = auth.currentUser as User | null;
  const diaryEntry = useAppSelector((state: RootState) => state.diaryList.list);
  const [fetching, setFetching] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const privateFlag = import.meta.env.VITE_ISPRIVATE;
  const publicFlag = import.meta.env.VITE_ISPUBLIC;

  useEffect(() => {
    const myDiary = async () => {
      const ref = collection(db, "diary");
      const userID = user?.uid;
      if (!userID) {
        throw new Error("User ID is undefined");
      }
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
    myDiary();
  }, []);

  if (fetching) {
    return (
      <div className="text-main text-3xl text-center mt-48">
        <SyncLoader color="#63004F" />
      </div>
    );
  }

  const diaryList =
    Array.isArray(diaryEntry) &&
    diaryEntry?.map((el, index: number) => {
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
      const monthOfYear = monthsOfYear[el.createdDate?.getMonth()];
      const date = el.createdDate?.getDate();
      const year = el.createdDate?.getFullYear();
      //! date format
      const formattedDate = `${date} ${monthOfYear} ${year}`;
      //! time formate
      const hours = el.createdDate.getHours();
      const minutes = el.createdDate.getMinutes();
      const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}`;
      return (
        <Skeleton
          el={el}
          index={index}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          privateFlag={privateFlag}
          publicFlag={publicFlag}
        />
      );
    });

  console.log(diaryEntry);

  return (
    <>
      {diaryEntry.length === 0 ? (
        <p className="py-3 text-isPublic">
          No diary entries found for this category.
        </p>
      ) : (
        diaryList
      )}
    </>
  );
};

export default Diary;
