import { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { toast } from "react-toastify";
import DeleteEntry from "./DeleteEntry";
import { useFormik } from "formik";
import { ClipLoader } from "react-spinners";
import { DeleteDiaryElement } from "../features/DeleteDiary";
import { UpdateDiaryElement } from "../features/UpdateDiary";
import { useAppDispatch } from "../hooks/hook";
// import { RootState } from "../app/store";
interface diaryList {
  id: string;
  image: string;
  category: string;
  description: string;
  isPublic: boolean;
  createdDate: Date;
  userID: string;
}

interface User {
  uid: string;
}

interface Props {
  index: number;
  el: diaryList;
  formattedDate: string;
  formattedTime: string;
  privateFlag: string;
  publicFlag: string;
}
interface editValue {
  isPublic_edit: boolean;
}

const Skeleton = ({
  el,
  formattedDate,
  formattedTime,
  privateFlag,
  publicFlag,
}: Props) => {
  const formik = useFormik<editValue>({
    initialValues: {
      isPublic_edit: el.isPublic,
    },
    onSubmit: ({ isPublic_edit }) => {
      console.log(isPublic_edit);
    },
  });
  const dispatch = useAppDispatch();
  // Define a function to delete a diary entry
  const user = auth.currentUser as User | null;

  const [diaryDelete, setDiaryDelete] = useState<boolean>(false);
  const [diaryUpdate, setDiaryUpdate] = useState<boolean>(false);
  const diaryRef = collection(db, "diary");
  const deleteList = async (entryId: string, el: diaryList) => {
    let result: diaryList[] = [];
    if (el.id === entryId) {
      result = [el];
    }
    try {
      setDiaryDelete(true);
      await deleteDoc(doc(diaryRef, entryId));
      dispatch(DeleteDiaryElement(result));
      console.log(`Document with ID ${entryId} deleted successfully`);
      setDiaryDelete(false);
      toast.success("diary entry deleted successfully");
    } catch (error) {
      console.log("Error deleting document: ", error);
      toast.error("Error deleting diary entry");
    }
  };

  const updateList = async (entryId: string, el: diaryList) => {
    let resultUpdate: diaryList[] = [];
    if (el.id === entryId) {
      resultUpdate = [el];
    }
    try {
      setDiaryUpdate(true);
      await updateDoc(doc(diaryRef, entryId), {
        ...el,
        isPublic: !formik.values.isPublic_edit,
        createdDate: serverTimestamp(),
      });
      dispatch(UpdateDiaryElement(resultUpdate));
      setDiaryUpdate(false);
      toast.success("diary entry updated successfully");
    } catch (error) {
      console.log("Error deleting document: ", error);
      toast.error("Error updating diary entry");
    }
  };
  // when you create a diary entry you will be able to update it from private to public and vice versa, and you can also delete the diary entry
  if (!user) {
    throw new Error("User ID is undefined");
  }
  const userID = user.uid;

  const showDelModal = () => {
    setDiaryDelete(true);
  };
  const hideDelModal = () => {
    setDiaryDelete(false);
  };

  return (
    <section className="my-6 w-full" key={el.id}>
      <div className="flex justify-between items-center">
        <div className="w-[100px] h-[100px]">
          <img
            src={el?.image}
            alt="diary image"
            className="w-full h-full bg-contain border rounded-md"
          />
        </div>
        <div className="flex flex-col w-[80%] pl-6">
          <div className="flex justify-between">
            <h3 className="text-xl">{el?.category}</h3>
            {userID === el?.userID ? (
              <span>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-isPublic cursor-pointer"
                  onClick={showDelModal}
                />
              </span>
            ) : null}
          </div>
          <span className="text-[1rem]">
            <span>{formattedDate}</span>
            <span className="px-2">@</span>
            <span>{formattedTime}</span>
          </span>
          <span className="flex items-center font-medium">
            <small
              className={`${
                el?.isPublic ? "text-isPublic" : "text-isPrivate"
              } italic pr-1 text-sm`}
            >
              {el.isPublic ? "Public" : "Private"}
            </small>
            <span className="w-[15px] h-[15px]">
              <img
                src={el.isPublic ? publicFlag : privateFlag}
                className={`${
                  el.isPublic ? "w-full h-full -mt-[0.09rem]" : "w-full h-full"
                } object-contain`}
              />
            </span>
            {userID === el?.userID ? (
              <label className="switch mx-2">
                <input
                  type="checkbox"
                  checked={formik.values.isPublic_edit}
                  {...formik.getFieldProps("isPublic_edit")}
                  onClick={() => updateList(el.id, el)}
                  disabled={diaryUpdate}
                />
                <span
                  className={`slider round ${
                    el.isPublic ? "bg-isPrivate public" : "bg-isPublic private"
                  } checked:bg-${el.isPublic ? "isPublic" : "isPrivate"}`}
                ></span>
              </label>
            ) : null}

            {userID === el?.userID && diaryUpdate && (
              <ClipLoader
                color="#63004F"
                speedMultiplier={0.6}
                size={20}
                className="pl-3"
              />
            )}
          </span>
        </div>
      </div>
      <p className="pt-2 text-sm italic">{el?.description}</p>
      {diaryDelete ? (
        <DeleteEntry
          hideDelModal={hideDelModal}
          deleteList={() => deleteList(el.id, el)}
          diaryDelete={!diaryDelete}
        />
      ) : null}
    </section>
  );
};

export default Skeleton;
//  ${el.isPublic ? "checked:bg-isPublic" : "checked:bg-isPrivate"}
