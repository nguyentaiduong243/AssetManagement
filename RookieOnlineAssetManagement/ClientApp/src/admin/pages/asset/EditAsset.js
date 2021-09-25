import { useEffect, useState } from "react";
import LayoutAdmin from "../layout/LayoutAdmin";
import { useForm, Controller } from "react-hook-form";
import { NavLink, useHistory, useParams } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import { getApiAssets } from "./assetsApi";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object().shape({
  assetName: Yup.string()
    .required("Asset Name is required")
    .matches(/^[aA-zZ\s 0-9]+$/, "Invalid keyword")
    .min(2, "This has to be at least 2 charaters")
    .max(30,"Asset Name has a maximum limit of 30 characters"),
  installedDate: Yup.date()
    .required("Installed Date is required")
    .typeError("Installed Date is required"),
  state: Yup.string().required("Select State is required"),
  specification: Yup.string()
    .max(255,"Specification has a maximum limit of 255 characters"),
});

const EditAsset = (props) => {
  const [installedDate, setInstalledDate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  const loadAssets = async () => {
    await getApiAssets
      .getAsset(id)
      .then((res) => {
        setInstalledDate(setDateTime(res.data[0].installedDate));
        reset({
          id: res.data[0].id,
          assetCode: res.data[0].assetCode,
          assetName: res.data[0].assetName,
          specification: res.data[0].specification,
          installedDate: setDateTime(res.data[0].installedDate),
          categoryName: res.data[0].categoryName,
          state: res.data[0].assetState,
        });
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  };

  const setDateTime = (data) => {
    let d = new Date(data.slice(0, 10));
    d = new Date(d.setHours(0));
    let date = new Date(d.setHours(d.getHours() + 7));

    return date;
  };

  function updateAssets(assets) {
    return getApiAssets
      .updateAsset(assets, id)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Update asset sucessfully");
          history.push("/admin/assets");
        }
      })
      .catch((error) => {
        setError(error);
        toast.error("Update asset failed");
      });
  }

  useEffect(() => {
    loadAssets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { register, handleSubmit, control, reset, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = (data) => {
    updateAssets(data);
  };

  return (
    <LayoutAdmin>
      <div className="table__view">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__title">Edit Asset</div>
          <div className="form__field">
            <label>Name</label>
            <input className="input" {...register("assetName")} />
          </div>
          <div className="form__field">
            <label>Category</label>
            <input
              className={`input ${errors.assetName ? "is-invalid" : ""}`}
              {...register("categoryName")}
              disabled
            />
          </div>
          <p className="invalid-feedback">{errors.assetName?.message}</p>

          <div className="form__field">
            <label>Specification</label>
            <textarea
              className="input"
              defaultValue={""}
              {...register("specification")}
            />
          </div>
          <p className="invalid-feedback">{errors.specification?.message}</p>

          <div className="form__field">
            <label>Installed Date</label>
            <div className="date-picker">
              <Controller
                control={control}
                name="installedDate"
                required={true}
                render={({ field: { onChange } }) => (
                  <ReactDatePicker
                    id="doB"
                    selected={installedDate}
                    onChange={(e) => {

                      onChange(e);
                      setInstalledDate(e);
                    }}
                    placeholderText="MM/DD/YY"
                    withPortal
                    showYearDropdown
                    showMonthDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    dropdownMode="select"
                    className="input"
                    error={errors.installedDate}
                  />
                )}
              />
            </div>
          </div>
          <p className="invalid-feedback">{errors.installedDate?.message}</p>

          <div className="form__field">
            <label>State</label>
            <div className="custom__select">
              <select
                {...register("state")}
                className={`input ${errors.categoryId ? "is-invalid" : ""}`}
              >
                <option value={0}>Available</option>
                <option value={2}>Not Available</option>
                <option value={4}>Waiting For Recycling</option>
                <option value={5}>Recycled</option>
              </select>
            </div>
          </div>
          <p className="invalid-feedback">{errors.state?.message}</p>

          <div className="form__field">
            <input type="submit" className="btn" value="Save" />
            <NavLink to="/admin/assets/">
              <button className="btn__cancel">Cancel</button>
            </NavLink>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default EditAsset;
