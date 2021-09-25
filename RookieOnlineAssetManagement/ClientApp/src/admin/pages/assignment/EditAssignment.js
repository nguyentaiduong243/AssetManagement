import { useForm, Controller } from "react-hook-form";
import LayoutAdmin from "../layout/LayoutAdmin";
import ReactDatePicker from "react-datepicker";
import { useHistory, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectUser from "./SelectUser/SelectUser";
import SelectAsset from "./SelectAsset/SelectAsset";
import axios from "axios";
import "./Assignment.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const schema = Yup.object().shape({
  assignToId: Yup.number()
    .required("User is required")
    .typeError("User is required"),
  assetId: Yup.number()
    .required("Asset is required")
    .typeError("Asset is required"),
  assignedDate: Yup.date()
    .required("Assigned Date is required")
    .typeError("Assigned Date is required"),
  note: Yup.string().max(255, "Note has a maximum limit of 255 characters"),
});

const userInfoJSON = window.localStorage.getItem("userInfo");
const userInfo = window.JSON.parse(userInfoJSON);

function CreateAssignment() {
  const [userModal, setUserModal] = useState(false);
  const [assetModal, setAssetModal] = useState(false);
  const [fullName, setFullName] = useState();
  const [assetName, setAssetName] = useState();
  const [submitData, setSubmitData] = useState({
    assignToId: "",
    assetId: "",
    assignedDate: null,
    assignById: userInfo.userId,
  });

  const history = useHistory();
  const { id } = useParams();

  const { register, handleSubmit, control, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  useEffect(() => {
    axios
      .get(`/api/Assignments/${id}`)
      .then((res) => {
        let assignedDate = new Date(res.data.assignDate.slice(0, 10));
        setFullName(res.data.assignTo);
        setAssetName(res.data.assetName);
        setSubmitData((prev) => {
          return {
            ...prev,
            assetId: res.data.assetId,
            assignById: res.data.assignById,
            assignToId: res.data.assignToId,
            note: res.data.note,
            assignedDate: assignedDate,
          };
        });
        reset({
          assetId: res.data.assetId,
          assignById: res.data.assignById,
          assignToId: res.data.assignToId,
          note: res.data.note,
          assignedDate: assignedDate,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = (data) => {
    axios
      .put(`/api/Assignments/${id}`, data)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Edit assignment sucessfully");
          history.push("/admin/assignments");
        }
      })
      .catch((err) => {
        toast.error("Edit assignment failed");
        console.log(err);
      });
  };

  const openUserModal = () => {
    setUserModal(true);
  };

  const openAssetModal = () => {
    setAssetModal(true);
  };

  const handleSaveUserModal = () => {
    setUserModal(false);
    reset({
      ...submitData,
      assignToId: submitData.assignToId,
    });
  };

  const handleCancelUserModal = () => {
    setUserModal(false);
    setFullName("");
    setSubmitData((prev) => {
      return {
        ...submitData,
        assignToId: "",
      };
    });
    reset({
      ...submitData,
      assignToId: "",
    });
  };

  const handleSaveAssetModal = () => {
    setAssetModal(false);
    reset({
      ...submitData,
      assetId: submitData.assetId,
    });
  };

  const handleCancelAssetModal = () => {
    setAssetModal(false);
    setAssetName("");
    setSubmitData((prev) => {
      return {
        ...submitData,
        assetId: "",
      };
    });
    reset({
      ...submitData,
      assetId: "",
    });
  };

  const handleSelectUser = (value) => {
    setSubmitData((prev) => {
      return {
        ...prev,
        assignToId: value.id,
      };
    });
    setFullName(value.firstName + " " + value.lastName);
  };

  const handleSelectAsset = (value) => {
    setSubmitData((prev) => {
      return {
        ...prev,
        assetId: value.id,
      };
    });
    setAssetName(value.assetName);
  };

  const handleSetAssignedDate = (e, onChange) => {
    let utcDate = new Date(e.setHours(e.getHours() + 10));
    onChange(utcDate);
    setSubmitData((prev) => {
      return {
        ...submitData,
        assignedDate: utcDate,
      };
    });
  };

  return (
    <LayoutAdmin>
      <div className="table__view">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__title">Edit Assignment</div>

          <div className="form__field">
            <label>User</label>
            <input className="input" {...register("assignToId")} hidden />
            <input className="input" value={fullName} disabled required />
            <div className="search-btn" onClick={openUserModal}>
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div className="invalid-feedback">
            <p>{errors.assignToId?.message}</p>
          </div>

          <div className="form__field">
            <label>Asset</label>
            <input className="input" {...register("assetId")} hidden />
            <input
              className="input"
              value={assetName}
              name="assetName"
              disabled
            />
            <div className="search-btn" onClick={openAssetModal}>
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div className="invalid-feedback">
            <p>{errors.assetId?.message}</p>
          </div>

          <div className="form__field">
            <label>Assigned Date</label>
            <div className="date-picker">
              <Controller
                control={control}
                name="assignedDate"
                required={true}
                render={({ field: { onChange } }) => (
                  <ReactDatePicker
                    selected={submitData.assignedDate}
                    onChange={(e) => handleSetAssignedDate(e, onChange)}
                    placeholderText="MM/DD/YY"
                    withPortal
                    showYearDropdown
                    showMonthDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    dropdownMode="select"
                    className="input"
                    error={errors.assignedDate}
                  />
                )}
                rules={{
                  required: true,
                }}
              />
            </div>
          </div>
          <div className="invalid-feedback">
            <p>{errors.assignedDate?.message}</p>
          </div>

          <div className="form__field">
            <label>Note</label>
            <textarea
              className="input"
              {...register("note")}
              onChange={(e) =>
                setSubmitData((prev) => {
                  return {
                    ...submitData,
                    note: e.target.value,
                  };
                })
              }
            />
          </div>
          <div className="invalid-feedback">
            <p>{errors.note?.message}</p>
          </div>

          <div className="form__field">
            <input type="submit" className="btn" value="Save" />
            <NavLink to="/admin/assignments/">
              <button className="btn__cancel">Cancel</button>
            </NavLink>
          </div>
        </form>
      </div>

      <Modal
        isOpen={userModal}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeUserModal}
        style={customStyles}
      >
        <div className="modal-wrapper">
          <div className="modal-body">
            <SelectUser
              onSelectUser={handleSelectUser}
              onSaveUserModal={handleSaveUserModal}
              onCancelUserModal={handleCancelUserModal}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={assetModal}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeAssetModal}
        style={customStyles}
      >
        <div className="modal-wrapper">
          <div className="modal-body">
            <SelectAsset
              onSelectAsset={handleSelectAsset}
              onSaveAssetModal={handleSaveAssetModal}
              onCancelAssetModal={handleCancelAssetModal}
            />
          </div>
        </div>
      </Modal>
    </LayoutAdmin>
  );
}

export default CreateAssignment;
