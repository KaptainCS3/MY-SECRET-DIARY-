import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import diaryList from "../types/DiaryList.type";
interface controller {
  hideDelModal: () => void;
  deleteList: () => void;
  // diaryDelete: boolean;
  index: diaryList[];
  confirmDisabled: boolean;
}

const DeleteEntry = ({
  hideDelModal,
  deleteList,
  // diaryDelete,
  index,
  confirmDisabled,
}: controller) => {
  // console.log(diaryDelete);
  return (
    <div className="success_modal animate">
      <section className="w-[85%] h-[30rem] shadow-2xl bg-white flex my-[5rem] mx-auto">
        <div className="flex flex-col justify-between w-full">
          <div className="py-2 bg-isPublic_switch w-full">
            <h3 className="text-white text-2xl flex items-center justify-center flex-col">
              Delete #<small className="text-sm">{index[0]["id"]}</small>
            </h3>
          </div>
          <div className="w-full h-[80%] flex flex-col items-center">
            <span>
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-[7rem] text-isPublic_switch mt-8"
              />
            </span>
            <p className="font-bold text-isPublic_switch text-xl text-center px-10 my-8">
              Are you sure you want to delete this diary entry?
            </p>
            <div className="flex justify-between w-full px-8">
              <Button
                textContent={confirmDisabled ? "" : "No"}
                styleProps={`w-[45%] font-bold bg-black flex justify-center items-center text-white text-lg text-white py-2 rounded-md ${
                  confirmDisabled ? "px-2" : "px-8"
                }`}
                type="button"
                actionBtn={hideDelModal}
                disabled={confirmDisabled}
              />
              <Button
                textContent={confirmDisabled ? "" : "Yes"}
                styleProps={`w-[45%] font-bold text-lg flex justify-center items-center text-isPublic border border-isPublic_switch bg-white py-2 rounded-md text-isPublic ${
                  confirmDisabled ? "px-2" : "px-8"
                }`}
                type="submit"
                actionBtn={deleteList}
                disabled={confirmDisabled}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeleteEntry;

{
  /* <div className="w-full min-h-[100vh] fixed top-0 left-0 background">
  <Modal handleSubmit={props.handleSubmit} editForm={props.editForm} />
</div>

.background{
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0, 0.4);
}
*/
}
