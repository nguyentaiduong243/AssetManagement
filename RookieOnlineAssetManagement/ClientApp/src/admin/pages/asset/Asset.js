import LayoutAdmin from '../layout/LayoutAdmin';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getApiAssets } from './assetsApi';
import AssetsTable from './AssetsTable';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import '../TableView.css';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import AssetDetailModal from './AssetDetailModal';
import { modalCustomStyle } from '../ModalCustomStyles';
import DeleteModal from './DeleteModal';

const userInfoJSON = window.localStorage.getItem('userInfo');
const userInfo = window.JSON.parse(userInfoJSON);

function Asset() {
  const [assets, setAssets] = useState([]);
  const [asset, setAsset] = useState([]);
  const [assetHistories, setAssetHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    PageNumber: 1,
    PageSize: 10,
    state: null,
    categoryName: null,
    keyword: null,
    sortBy: null,
    asc: true,
    location: userInfo.location,
  });

  const assetsRef = useRef(null);
  const assetIdRef = useRef(null);
  const typingTimoutRef = useRef(null);
  const history = useHistory();

  const getassets = () => {
    setLoading(true);
    const paramString = queryString.stringify(filters);
    getApiAssets
      .getAssets(paramString)
      .then((res) => {
        assetsRef.current = res.data.data;
        setAssets(res.data.data);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getassets, [changes, filters]);

  const getAssetId = async (rowIndex) => {
    if (!assetsRef.current) return;
    const id = assetsRef.current[rowIndex].id;
    if (id) {
      history.push(`/admin/assets/edit/${id}`);
    }
  };

  const handleState = (value) => {
    if (value === 0) return 'Available';
    if (value === 1) return 'Waiting For Approval';
    if (value === 2) return 'Not Available';
    if (value === 3) return 'Assigned';
    if (value === 4) return 'Waiting For Recycling';
    if (value === 5) return 'Recycled';
    return null;
  };

  const handleSortBy = (sortBy) => {
    setTotalPages(0);
    setFilters((prev) => {
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          asc: !prev.asc,
          PageNumber: 1,
        };
      }
      return {
        ...prev,
        sortBy: sortBy,
        asc: true,
        PageNumber: 1,
      };
    });
  };

  const handleSortIcon = (sortBy) => {
    if (filters.sortBy === sortBy) {
      if (filters.asc) {
        return <i className='fas fa-caret-down'></i>;
      }
      return <i className='fas fa-caret-up'></i>;
    }
    return <i className='fas fa-caret-down'></i>;
  };

  const handleSearchChange = (value) => {
    if (typingTimoutRef.current) {
      clearTimeout(typingTimoutRef.current);
    }

    typingTimoutRef.current = setTimeout(() => {
      setTotalPages(0);
      setFilters({
        ...filters,
        keyword: value,
        PageNumber: 1,
      });
    }, 500);
  };

  const handlePageClick = (data) => {
    const currentPage = data.selected;
    setFilters({
      ...filters,
      PageNumber: currentPage + 1,
    });
  };

  const handleSelectState = (event) => {
    setTotalPages(0);
    if (!event) {
      event = {
        target: '',
        value: null,
      };
    }
    setFilters({
      ...filters,
      state: event.value,
      PageNumber: 1,
    });
  };

  const handleSelectCategory = (event) => {
    setTotalPages(0);
    if (!event) {
      event = {
        target: '',
        value: null,
      };
    }
    setFilters({
      ...filters,
      categoryName: event.value,
      PageNumber: 1,
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleShowAssetDetail = async (value) => {
    console.log(value);
    setAsset(value);
    await getApiAssets
      .getAssetDetails(value.id)
      .then((res) => {
        setAssetHistories(res.data);
      })
      .catch((err) => {
        setError(err);
      });
    openModal();
  };

  const handleClickDeleteBtn = (rowIndex) => {
    if (!assetsRef.current) return;
    const id = assetsRef.current[rowIndex].id;
    if (id) {
      assetIdRef.current = id;
    }
    setDeleteModal(true);
  };

  const handleDeleteAsset = () => {
    getApiAssets
      .deleteAsset(assetIdRef.current)
      .then((res) => {
        setChanges((prev) => {
          const current = !prev;
          return current;
        });
        if (res.status) {
          setDeleteModal(false);
          toast.success('Asset Deleted');
        }
      })
      .catch((err) => {
        setDeleteModal(false);
        if (err.response.status) {
          toast.error(
            err.response.data +
              '. ' +
              'If the asset is not able to be used anymore, please update its state in edit asset'
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assetCode')}
            >
              <span>Asset Code</span>
              {handleSortIcon('assetCode')}
            </div>
          );
        },
        accessor: 'assetCode',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assetName')}
            >
              <span>Asset Name</span>
              {handleSortIcon('assetName')}
            </div>
          );
        },
        accessor: 'assetName',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('categoryName')}
            >
              <span>Category Name</span>
              {handleSortIcon('categoryName')}
            </div>
          );
        },
        accessor: 'categoryName',
      },
      {
        id: 'state',
        Header: () => {
          return (
            <div className='table-header' onClick={() => handleSortBy('state')}>
              <span>State</span>
              {handleSortIcon('state')}
            </div>
          );
        },
        accessor: (d) => <div>{handleState(d.state)}</div>,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          const rowIdx = row.id;
          return (
            <div id='actions' style={{ display: 'flex' }}>
              {row.original.state === 3 || row.original.state === 1 ? (
                <span className='font' style={{ color: 'rgba(0, 0, 0, 0.2)' }}>
                  <i className='bx bx-edit'></i>
                </span>
              ) : (
                <span className='font' onClick={() => getAssetId(rowIdx)}>
                  <i className='bx bx-edit'></i>
                </span>
              )}
              &emsp;
              {row.original.state === 3 ? (
                <span className='font' style={{ color: 'rgba(0, 0, 0, 0.2)' }}>
                  <i className='fas fa-times'></i>
                </span>
              ) : (
                <span
                  className='font'
                  onClick={() => handleClickDeleteBtn(rowIdx)}
                >
                  <i className='fas fa-times'></i>
                </span>
              )}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  );
  return (
    <>
      <LayoutAdmin>
        <AssetsTable
          columns={columns}
          data={assets}
          loading={loading}
          onSearchChange={handleSearchChange}
          onSelectState={handleSelectState}
          onSelectCategory={handleSelectCategory}
          onShowAssetDetail={handleShowAssetDetail}
        />
        <div className='paging-box'>
          {totalPages > 0 && (
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={totalPages || 1}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          )}
        </div>
      </LayoutAdmin>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalCustomStyle}
      >
        <AssetDetailModal
          asset={asset}
          assetHistories={assetHistories}
          closeModal={closeModal}
        />
      </Modal>

      <Modal isOpen={deleteModal} style={modalCustomStyle}>
        <DeleteModal
          closeDeleteModal={closeDeleteModal}
          onDeleteAsset={handleDeleteAsset}
          title='Do you want to delete this asset?'
        />
      </Modal>
    </>
  );
}

export default Asset;
