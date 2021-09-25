import { useState, useEffect } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { NavLink, useHistory } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { getApiAssets } from './assetsApi';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ModalForm from './ModalForm';
import Select, { components } from 'react-select';

import './Asset.css';

const schema = Yup.object().shape({
  assetName: Yup.string()
    .required('Asset Name is required')
    .matches(/^[aA-zZ\s 0-9]+$/, 'Invalid keyword')
    .min(2, "This has to be at least 2 charaters")
    .max(30,"Asset Name has a maximum limit of 30 characters"),
  installedDate: Yup.date()
    .required('Installed Date is required')
    .typeError('Installed Date is required'),
  categoryId: Yup.number().required('Select Category is required'),
  specification: Yup.string()
    .max(255,"Specification has a maximum limit of 255 characters"),
  state: Yup.string().required('Select State is required'),
});

const Control = ({ children, ...props }) => {
  const { onCreateCategory } = props.selectProps;
  const style = { cursor: 'pointer' };

  return (
    <components.Control {...props} className='select-category'>
      {children}
      <span
        onMouseDown={onCreateCategory}
        style={style}
        title='Create Category'
      >
        <i class='fas fa-plus-circle'></i>
      </span>
    </components.Control>
  );
};

const CreateAsset = (props) => {
  const [modalIsOpen, setModelIsOpen] = useState(false);
  const [installedDate, setInstalledDate] = useState();
  const [categories, setCategories] = useState([]);
  const [changes, setChanges] = useState(false);
  const history = useHistory();

  const onClick = (e) => {
    handleChange();
    e.preventDefault();
    e.stopPropagation();
  };
  const {
    register,
    handleSubmit,
    control,
     reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('userInfo'));
    if (items) {
      reset({
        location: items.location,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onSubmit = async (data) => {
    await handleAsset(data);
  };

  function handleAsset(assets) {
    return getApiAssets
      .createAsset(assets)
      .then((response) => {
        if (response.status) {
          toast.success('Add Asset sucessfully');
          history.push('/admin/assets');
        }
      })
      .catch((error) => {
        toast.error('Add asset failed!');
      });
  }

  const getCategories = () => {
    getApiAssets
      .getCategories()
      .then((res) => res.data)
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => err);
  };
  useEffect(getCategories, [changes]);

  const handleChange = () => {
    setModelIsOpen(true);
  };

  const options =
    categories &&
    categories.map((category) => {
      return { label: category.name, value: category.id };
    });

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form__title'>Create Asset</div>

          <div className='form__field'>
            <label>Name</label>
            <input
              {...register('assetName')}
              className={`input ${errors.assetName ? 'is-invalid' : ''}`}
            />
          </div>
          <p className='invalid-feedback'>{errors.assetName?.message}</p>

          <div className='form__field'>
            <label>Category</label>
            <div className='custom__select'>
              {/* {categories && (
                <select
                  {...register('categoryId')}
                  className={`input ${errors.categoryId ? 'is-invalid' : ''}`}
                >
                  <option value=''>Select</option>
                  {categories.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </select>
              )} */}
              <Controller
                name='categoryId'
                control={control}
                render={({ field }) => (
                  <Select
                    {...props}
                    options={options}
                    onChange={(e) => field.onChange(e.value)}
                    value={options.find((c) => c.value === field.value)}
                    onCreateCategory={onClick}
                    components={{ Control }}
                    placeholder='Select or Create New Category'
                    error={errors.categoryId}
                  />
                )}
              />
            </div>
          </div>
           <p className='invalid-feedback'>{errors.categoryId?.message}</p> 
           <input id='location' {...register('location')} className='input' hidden />
          <div className='form__field'>
            <label>Specification</label>
            <textarea
              defaultValue={''}
              {...register('specification')}
              className='input'
            />
          </div>
          <p className='invalid-feedback'>{errors.specification?.message}</p>

          <div className='form__field'>
            <label>Installed Date</label>
            <div className='date-picker'>
            <Controller
              control={control}
              name='installedDate'
              render={({ field: { onChange } }) => (
                <ReactDatePicker
                  id='installedDate'
                  selected={installedDate}
                  onChange={(e) => {
                    e = new Date(e.setHours(0));
                    let d = new Date(e.setHours(e.getHours() + 7));
                    onChange(d);
                    setInstalledDate(d);
                  }}
                  placeholderText='MM/DD/YY'
                  withPortal
                  showYearDropdown
                  showMonthDropdown
                  dateFormatCalendar='MMMM'
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  dropdownMode='select'
                  className='input'
                  styles={{ width: '200px' }}
                  error={errors.installedDate}
                />
              )}
            />
            </div>
          </div>
          <p className='invalid-feedback'>{errors.installedDate?.message}</p>

          <div className='form__field'>
            <label>State</label>
            <div className='custom__select'>
              <select
                {...register('state')}
                className={`input ${errors.categoryId ? 'is-invalid' : ''}`}
              >
                <option value=''>Select</option>
                <option value={0}>Available</option>
                <option value={2}>Not Available</option>
              </select>
            </div>
          </div>
          <p className='invalid-feedback'>{errors.state?.message}</p>

          <div className='form__field'>
            <input type='submit' className='btn' value='Create' />
            <NavLink to='/admin/assets/'>
              <button className='btn__cancel'>Cancel</button>
            </NavLink>
          </div>
        </form>
        <ModalForm
          modalIsOpen={modalIsOpen}
          setModelIsOpen={setModelIsOpen}
          setChanges={setChanges}
        />
      </div>
    </LayoutAdmin>
  );
};

export default CreateAsset;
