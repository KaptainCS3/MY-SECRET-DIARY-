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
  const diaryDeleteList = useAppSelector(
    (state: RootState) => state.diaryDelete
  );
  const diaryUpdateList = useAppSelector(
    (state: RootState) => state.diaryUpdate
  );
  const [fetching, setFetching] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const privateFlag = import.meta.env.VITE_ISPRIVATE;
  const publicFlag = import.meta.env.VITE_ISPUBLIC;

  useEffect(() => {
    console.log("useEffect in Diary component is running");
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
          const updatedAt = data?.updatedAt?.toDate();
          const startDate = data?.startDate?.toDate();
          const endDate = data?.endDate?.toDate();
          return {
            id: doc.id,
            image: data.image,
            category: data.category,
            description: data.description,
            isPublic: data.isPublic,
            createdAt,
            updatedAt,
            startDate,
            endDate,
            userID: data.userID,
          };
        });

        const publicEntries = publicEntriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt.toDate();
          const updatedAt = data?.updatedAt?.toDate();
          const startDate = data?.startDate?.toDate();
          const endDate = data?.endDate?.toDate();
          return {
            id: doc.id,
            image: data.image,
            category: data.category,
            description: data.description,
            isPublic: data.isPublic,
            createdAt,
            updatedAt,
            startDate,
            endDate,
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
  }, [user, dispatch, diaryDeleteList, diaryUpdateList]);

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
      const monthOfYear = monthsOfYear[el.createdAt?.getMonth()];
      const date = el.createdAt?.getDate();
      const year = el.createdAt?.getFullYear();
      //! date format
      const formattedDate = `${date} ${monthOfYear} ${year}`;
      //! time formate
      const hours = el.createdAt.getHours();
      const minutes = el.createdAt.getMinutes();
      const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}`;

      const monthOfYearUpdate = monthsOfYear[el.updatedAt?.getMonth()];
      const dateUpdate = el.updatedAt?.getDate();
      const yearUpdate = el.updatedAt?.getFullYear();
      //! date format
      const formattedDateUpdate = `${dateUpdate} ${monthOfYearUpdate} ${yearUpdate}`;
      //! time formate
      const hoursUpdate = el.updatedAt?.getHours();
      const minutesUpdate = el.updatedAt?.getMinutes();
      const formattedTimeUpdate = `${
        hoursUpdate < 10 ? "0" : ""
      }${hoursUpdate}:${minutes < 10 ? "0" : ""}${minutesUpdate}`;
      return (
        <Skeleton
          el={el}
          index={index}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          formattedDateUpdate={formattedDateUpdate}
          formattedTimeUpdate={formattedTimeUpdate}
          privateFlag={privateFlag}
          publicFlag={publicFlag}
        />
      );
    });

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
