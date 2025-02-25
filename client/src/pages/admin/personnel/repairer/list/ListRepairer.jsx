import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, Badge, Breadcrumb, Button, Input, Space, Modal, Divider, Image, Table, Popconfirm, Switch, Dropdown, Menu, Upload } from 'antd'
import AdminLayout from '../../../../../layouts/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRepairer, getAll, getReparations, toggleProStatus, toggleActivation } from '../../../../../store/dashboard/repairer/repairerAction';
import { HomeOutlined, SearchOutlined, UserOutlined, CheckOutlined, CloseOutlined, CheckCircleFilled, EyeOutlined, EllipsisOutlined, DownOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';




import "./ListRepairer.css"
import AssignmentModal from './assignment-modal/AssignmentModal';
import ExcelUploadRepairer from '../../../../../components/forms/ExcelUploadRepairer';


const ListRepairer = () => {
    const { role } = useSelector((state) => state.auth);
    const { repairers, loading } = useSelector((state) => state.repairer) || { repairers: [], loading: true };;
    const [repairer, setrepairer] = useState({})
    const dispatch = useDispatch()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const switchActiveStyles = {
        backgroundColor: '#198754', // Green background color when checked
        borderColor: '#198754', // Green border color when checked
    };
    const switchInctiveStyles = {
        backgroundColor: '#dc3545', // Green background color when checked
        borderColor: '#dc3545', // Green border color when checked
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const handleShowProblemModal = (rep) => {
        setrepairer(rep)
        setShowModal(true)
    }


    const togglePro = async (repairer, isPro) => {
        await dispatch(toggleProStatus({ repairerId: repairer.id, isPro }));
        dispatch(getAll());
    };
    
    
    
    const menu = (repairer) => (
        <Menu>
            <Menu.Item 
                onClick={() => { 
                    console.log(repairer.id)
                    if (repairer.pro) {
                        togglePro(repairer, false);
                    } else {
                        togglePro(repairer, true);
                    }
                }}
                key="makePro"
            >
                <span>{repairer.pro ? "Rendre unpro " : "Rendre pro"}</span>
            </Menu.Item>

            <Menu.Divider />
            {/* <Menu.Item onClick={() => handleShowProblemModal(repairer)} key="assign">
                <span >Affecter</span>
            </Menu.Item> */}
        </Menu>
    );
    
    const columns = [
        {
            title: 'Profile',
            dataIndex: 'profil',
            key: 'profil',
            width: 100

        },
        {
            title: 'UserName',
            dataIndex: 'username',
            key: 'username',
            width: 150,
            ...getColumnSearchProps('username'),
        },
        {
            title: 'CIN',
            dataIndex: 'cin',
            key: 'cin',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 180
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Email verifie',
            dataIndex: 'emailVerified',
            key: 'emailVerified',
        },
        {
            title: 'Rib',
            dataIndex: 'rib',
            key: 'rib',
            width: 170
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Identity image',
            width: 120,
            align: 'center',
            render: (text, record) => (
                <>
                    {
                        record.cinPhotos && record.cinPhotos.length ? (
                            <Image.PreviewGroup
                                preview={{
                                    onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                }}
                            >
                                <Avatar.Group>
                                    {record.cinPhotos[0] && (
                                        <Image
                                            className='h-10 w-10 object-cover rounded-circle'
                                            src={record.cinPhotos[0].src}
                                        />
                                    )}
                                    {record.cinPhotos[1] && (
                                        <Image
                                            className='h-10 w-10 object-cover rounded-circle'
                                            src={record.cinPhotos[1].src}
                                        />
                                    )}
                                </Avatar.Group>
                            </Image.PreviewGroup>
                        ) : (
                            "No image"
                        )
                    }
                </>
            )
        },
        {
            title: 'Pro Status',
            dataIndex: 'pro',
            key: 'pro',
            align: 'center',
            render: (text, record) => (
                <CheckCircleFilled className={`text-lg ml-1 ${record.pro ? 'text-blue-500' : 'text-gray-400'}`} />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (text, record) => (
                role == "admin" ?
                <div className="flex gap-3 justify-center">
                    <Switch
                        checked={record.active}
                        onChange={(checked) => handleToggleActivation({ mode: checked ? 1 : 0, id: record.id })}
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        style={record.active ? switchActiveStyles : switchInctiveStyles}
                    />
                    <Dropdown overlay={() => menu(record)} trigger={['click']}>
                        <span className='cursor-pointer'>
                            <EllipsisOutlined className='text-blue-500 text-lg' />
                            <DownOutlined className='text-blue-500 ml-1' />
                        </span>
                    </Dropdown>
                </div>
                :
                <Switch
                checked={record.active}
                onChange={(checked) => handleToggleActivation({ mode: checked ? 1 : 0, id: record.id })}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                style={record.active ? switchActiveStyles : switchInctiveStyles}
                 />
            ),
        },


    ];

    const handleToggleActivation = async ({ mode, id }) => {
        await dispatch(toggleActivation({ mode, id }))
            .unwrap()
            .catch((err) => {
                console.log("Error", err);
            })
        dispatch(getAll())
    }
    useEffect(() => {
        dispatch(getAll())
    }, [dispatch])

    const data = repairers.map((repairer, key) => ({
        key: key,
        id: repairer.id,
        profil: repairer.imageProfile ? <img className='w-[40px] h-[40px] object-cover rounded-full' src={repairer.imageProfile} alt="" /> : <Avatar size="large" className='mr-2' icon={<UserOutlined />} />,
        username: repairer.username,
        cin: repairer.cin,
        email: repairer.email,
        address: repairer.address ? repairer.address : <Badge status="error" text="Non definie" />,
        emailVerified: repairer.emailVerified ? <Badge status="success" text="Verifie" /> : <Badge status="error" text="Non verifie" />,
        rib: repairer.rib,
        gender: repairer.gender ? "Homme" : "Femme",
        active: repairer.active,
        pro: repairer.pro,
        cinPhotos: repairer.cinPhotos && repairer.cinPhotos.length > 0 ? repairer.cinPhotos : null
    }));


    return (
        <AdminLayout>
            <div className="flex items-center">
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <HomeOutlined />,
                        },
                        {
                            href: '',
                            title: (
                                <>
                                    <span>Liste réparateur</span>
                                </>
                            ),
                        },
                    ]}
                />


            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{
                        x: 1300,
                    }}
                    pagination={{ pageSize: 4 }}
                    loading={loading}
                />
            </div>
            {
                showModal && <AssignmentModal repairer={repairer} setShowPopup={setShowModal} showPopup={showModal} />
            }
            <div className="App">
                <ExcelUploadRepairer />
            </div>
        </AdminLayout>
    );
};

export default ListRepairer;