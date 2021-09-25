import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LayoutAdmin from "../layout/LayoutAdmin";
import { useForm, Controller } from "react-hook-form";
import { useCreateUser } from "./UserHooks";
import ReactDatePicker from "react-datepicker";
import { NavLink, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";

const schema = Yup.object().shape({
  doB: Yup.date()
    .required("Enter New Date of Birth!")
    .typeError("Date of birth is required")
    .test("doB", "You must be 18 or older", function (doB) {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return doB <= cutoff;
    }),
  joinedDate: Yup.date()
    .required("Joined Date is required")
    .typeError("Joined Date is required")
    .min(
      Yup.ref("doB"),
      ({ min }) => `Joined Date Must be later than Date of birth`
    ),
});

const EditUser = () => {
  const [startDate, setStartDate] = useState();
  const [joinedDate, setJoinedDate] = useState();
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const history = useHistory();
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const loadUsers = () => {
    useCreateUser
      .getbyid(id)
      .then((res) => {
        setUsers(res.data.data);
        setStartDate(setDateTime(res.data.data.doB));
        setJoinedDate(setDateTime(res.data.data.joinedDate));
        reset({
          id: res.data.data.id,
          staffCode: res.data.data.staffCode,
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          joinedDate: setDateTime(res.data.data.joinedDate),
          doB: setDateTime(res.data.data.doB),
          gender: getGenderEnum(res.data.data.gender),
          location: res.data.data.location,
          userName: res.data.data.userName,
          roleType: res.data.data.roles[0],
        });
      })
      .catch((err) => {
        setError(err);
        console.log(error);
      });
  };

  function updateUsers(users) {
    return useCreateUser
      .edit(users, id)
      .then((response) => {
        if (response.status) {
          toast.success("Update user sucessfully");
          history.push("/admin/users");
        }
      })
      .catch((error) => {
        setError(error);
        toast.error("Update user failed");
      });
  }

  useEffect(() => {
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { register, handleSubmit, control, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const setDateTime = (data) => {
    let d = new Date(data.slice(0, 10));
    d = new Date(d.setHours(0));
    let date = new Date(d.setHours(d.getHours() + 7));

    return date;
  };

  const getGenderEnum = (gender) => {
    if (gender === "Female") return 0;
    return 1;
  };

  const onSubmit = async (data) => {
    await updateUsers(data);
  };
  return (
    <LayoutAdmin>
      <div className="table__view">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="form__title">Edit User</h2>
          <div className="form__field">
            <label className="form__label" htmlFor="staffCode">
              StaffCode
            </label>
            <input
              id="staffCode"
              {...register("staffCode")}
              className={`input`}
              disabled
            />
          </div>
          <div className="form__field">
            <label className="form__label" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              className={`input`}
              disabled
            />
          </div>
          <div className="form__field">
            <label className="form__label" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              className={`input`}
              disabled
            />
          </div>
          <div className="form__field">
            <label className="form__label" htmlFor="doB">
              Date of Birth
            </label>
            <div className="date-picker">
              <Controller
                control={control}
                name="doB"
                render={({ field: { onChange } }) => (
                  <ReactDatePicker
                    id="doB"
                    selected={startDate}
                    onChange={(d) => {
                      onChange(d);
                      setStartDate(d);
                    }}
                    placeholderText="MM/DD/YY"
                    withPortal
                    showYearDropdown
                    showMonthDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    dropdownMode="select"
                    error={errors.doB}
                    className="input"
                  />
                )}
              />
            </div>
          </div>
          <p className="invalid-feedback">{errors.doB?.message}</p>
          <div className="form__field">
            <label className="form__label" htmlFor="joinedDate">
              Joined Date
            </label>
            <div className="date-picker">
              <Controller
                control={control}
                name="joinedDate"
                render={({ field: { onChange } }) => (
                  <ReactDatePicker
                    id="joinedDate"
                    selected={joinedDate}
                    onChange={(d) => {
                      onChange(d);
                      setJoinedDate(d);
                    }}
                    filterDate={isWeekday}
                    placeholderText="MM/DD/YY"
                    withPortal
                    showYearDropdown
                    showMonthDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    dropdownMode="select"
                    error={errors.joinedDate}
                    className="input"
                    styles={{ width: "200px" }}
                  />
                )}
              />
            </div>
          </div>
          <p className="invalid-feedback">{errors.joinedDate?.message}</p>
          <div className="form__field">
            <label className="form__label" htmlFor="gender">
              Gender
            </label>
            <div className="custom__select">
              <select {...register("gender")} id="gender">
                <option value={0}>Female</option>
                <option value={1}>Male</option>
              </select>
            </div>
            {errors.gender && <span>Please input</span>}
          </div>
          <div className="form__field">
            <label className="form__label" htmlFor="roleType">
              Type
            </label>
            <div className="custom__select">
              <select
                className="form__input"
                {...register("roleType")}
                id="roleType"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          {errors.type && <span>This field is required</span>}
          <div className="form__field">
            <input type="submit" className="btn" value="Save" />
            <NavLink to="/admin/users/">
              <button className="btn__cancel">Cancel</button>
            </NavLink>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default EditUser;
