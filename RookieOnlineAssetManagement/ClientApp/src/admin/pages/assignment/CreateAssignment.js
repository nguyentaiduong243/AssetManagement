import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LayoutAdmin from "../layout/LayoutAdmin";
import ReactDatePicker from "react-datepicker";
import { useHistory } from "react-router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";
import * as Yup from "yup";

import SelectUser from "./SelectUser/SelectUser";
import SelectAsset from "./SelectAsset/SelectAsset";
import "./Assignment.css";
import axios from "axios";

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
    .typeError("User is required")
    .nullable(true),
  assetId: Yup.number()
    .required("Asset is required")
    .typeError("Asset is required")
    .nullable(true),
  // assignedDate: Yup.date()
  //   .required("Assigned Date is required")
  //   .typeError("Assigned Date is required")
  //   .min(
  //     format(new Date(), "MM/dd/yyyy"),
  //     "Only present and future day are allowed"
  //   ),
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
    assignToId: null,
    assetId: null,
    assignedDate: null,
    assignById: userInfo.userId,
  });

  const history = useHistory();

  const { register, handleSubmit, control, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const onSubmit = (data) => {
    axios
      .post("/api/Assignments", data)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Add assignment sucessfully");
          history.push("/admin/assignments");
        }
      })
      .catch((err) => {
        toast.error("Add assignment failed");
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
    setFullName(null);
    setSubmitData((prev) => {
      return {
        ...submitData,
        assignToId: null,
      };
    });
    reset({
      ...submitData,
      assignToId: null,
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
    setAssetName(null);
    setSubmitData((prev) => {
      return {
        ...submitData,
        assetId: null,
      };
    });
    reset({
      ...submitData,
      assetId: null,
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
    e = new Date(e.setHours(0));
    let utcDate = new Date(e.setHours(e.getHours() + 7));
    onChange(utcDate);
    setSubmitData({
      ...submitData,
      assignedDate: utcDate,
    });
  };

  return (
    <LayoutAdmin>
      <div className="table__view">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__title">Create Assignment</div>

          <div className="form__field">
            <label>User</label>
            <input className="input" {...register("assignToId")} hidden />
            <input
              className="input"
              value={fullName}
              disabled
              required
              error={errors.assignToId}
            />
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
              error={errors.assetId}
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
                    // error={errors.assignedDate}
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
              className={`input ${errors.firstName ? "is-invalid" : ""}`}
              {...register('note')}
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
            <input type="submit" className="btn" value="Create" />
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
