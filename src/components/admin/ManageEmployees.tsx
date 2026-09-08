import { Row, Col, Button, OverlayTrigger } from "react-bootstrap";

import { useManageEmployees } from "../../hooks/useManageEmployees";
import { useToast } from "../../context/ToastContext";
import { useSelectUsers } from "../../hooks/useSelectUsers";
import CreateEmployeeForm from "./CreateEmployeeForm";
import type { CreateEmployeeData, UpdateEmployeeData } from "../../services/userService";
import { useState } from "react";
import ManageEmployeesTable from "./ManageEmployeesTable";
import UpdateEmployeeForm from "./UpdateEmployeeForm";
import type { User } from "../../types/User";
import SearchBar from "../common/SearchBar";
import capitalizeString from "../../utils/capilatize-string";
import Popover from "../common/Popover";
import DownloadReviews from "./DowloadReviewsForm";
import type { ReviewCategory } from "../../types/Review";


type ManageEmployeesViewType = 'table' | 'add' | 'edit' | 'download';

interface ManageEmployeesProps {
    categories: ReviewCategory[];
}

export default function ManageEmployees({categories}: ManageEmployeesProps) {
    const [activeComponent, setActiveComponent] = useState<ManageEmployeesViewType>('table');
    const [selectedEditUser, setSelectedEditUser] = useState<User | null>(null);

    const {showToast} = useToast();
    const {usersData, loading: loadingUsers, reload: reloadUsers} = useSelectUsers('all');
    // const {usersData: downloadReviews, loading: loadingDownload} = useSelectUsers('single', selectedDownloadUser);
    const {create, update, loading: loadingManageEmployees} = useManageEmployees();

    const handleCreateEmployee = async (employeeData: CreateEmployeeData): Promise<void> => {
        try {
            const employee = await create(employeeData);

            await reloadUsers();

            showToast('User Created Successfully', [`${capitalizeString(employee.user_role.toLocaleUpperCase())} user added.`], 'success');
            setActiveComponent('table');
        } catch (err) {
            const message = (err instanceof Error) ? err.message : 'Unable to create user';
            showToast('Error', [message], 'danger');
        }
    };

    const handleUpdateEmployee = async (employeeData: UpdateEmployeeData): Promise<void> => {
        try {
            const employee = await update(employeeData);
                        
            await reloadUsers();

            showToast('User Updated Successfully', [`${capitalizeString(employee.user_role.toLocaleUpperCase())} user changed.`], 'success');
            setActiveComponent('table');
        } catch (err) {
            const message = (err instanceof Error) ? err.message : 'Unable to update user';
            showToast('Error', [message], 'danger');
        }
    }

    // search
    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = usersData.filter(user => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) {
            return true;
        }

        return (
            user.first_name?.toLowerCase().includes(search) ||
            user.last_name?.toLowerCase().includes(search) ||
            user.user_role?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="p-4">
            <h4>Manage Employees</h4>
            <small className="text-muted">{`Perform administrative actions (add, edit, disable users)`}</small>

            {(activeComponent === 'table') && 
                <>
                    <hr />  
                    <div>
                        <Row className="mb-3">
                            <Col md={3}>
                                <SearchBar
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Search employees..."
                                />
                            </Col>
                            <Col md={{span: 2, offset: 7}} className="d-flex justify-content-end">
                                <OverlayTrigger
                                    trigger={['hover', 'focus']}
                                    placement="left"
                                    overlay={
                                        <Popover body_text="Download Reviews" />
                                    }
                                >
                                    <Button 
                                        variant="secondary" 
                                        type="button" 
                                        className="mx-2" 
                                        onClick={() => setActiveComponent('download')}
                                    >
                                        <i className="bi bi-download"></i>
                                    </Button>   
                                </OverlayTrigger>
                                <Button variant="primary" type="button" onClick={() => setActiveComponent('add')}>
                                    <i className="bi bi-plus-circle"></i> Add User
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {
                        (!loadingUsers) ? 
                        (
                            <div>   
                                <ManageEmployeesTable 
                                    users={filteredUsers}
                                    onEdit={(user) => {
                                        setSelectedEditUser(user);
                                        setActiveComponent('edit');
                                    }}
                                />
                            </div>
                        ) : 
                        (
                            <div className="text-muted text-center my-auto">
                                <p className="">Loading employees...</p>
                            </div>
                        )
                    }
                </>
            }
            
            {(activeComponent === 'download') && 
                <DownloadReviews 
                    frontlineEmployees={usersData.filter(user => user.user_role === 'frontline')}
                    categories={categories}
                    onCancel={() => setActiveComponent('table')}
                />
            }

            {(activeComponent === 'add') && 
                <CreateEmployeeForm 
                    supervisors={usersData.filter(user => user.user_role === 'supervisor')}
                    loading={loadingManageEmployees}
                    onSubmit={(employee) => handleCreateEmployee(employee)}
                    onCancel={() => setActiveComponent('table')}
                />
            }            
            {(activeComponent === 'edit' && selectedEditUser) && 
                <UpdateEmployeeForm 
                    user={selectedEditUser}
                    supervisors={usersData.filter(user => user.user_role === 'supervisor')}
                    loading={loadingManageEmployees}
                    onSubmit={(employee) => handleUpdateEmployee(employee)}
                    onCancel={() => setActiveComponent('table')}
                />
            }

        </div>
    );
}