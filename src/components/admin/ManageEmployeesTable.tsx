import { Button, Table } from "react-bootstrap";
import type { User } from "../../types/User";
import capitalizeString from "../../utils/capilatize-string";
import Badge from "../common/Badge";
import daysSinceDate from "../../utils/days-since-date";

import ActiveCircle from '../../assets/icons/active-circle.svg';
import InactiveCircle from '../../assets/icons/inactive-circle.svg';

import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";

interface ManageEmployeesTableProps {
    users: User[];
    onEdit: (userId: User) => void;
}

export default function ManageEmployeesTable({users, onEdit}: ManageEmployeesTableProps) {
    // pagination
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 10;

    const totalPages = Math.ceil(users.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedUsers = users.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [users]);

    return (
        <>
            <div className={`manage-employees-table-container d-flex flex-column gap-3`}>
                <Table responsive striped hover className="align-middle mb-0">
                    <thead>
                        <tr className="border-top">
                            <th style={{width: '10%'}}>Status</th>
                            <th style={{width: '20%'}}>Name</th>
                            <th style={{width: '10%'}}></th>
                            <th style={{width: '5%'}}></th>
                            <th style={{width: '10%'}} className="text-center"></th>
                            <th ></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            paginatedUsers.sort((a, b) => (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0)).map(user => (
                                <tr key={user.user_id}>
                                    <td className="pl-2">
                                        <div className="mx-3">
                                            {user.is_active ? 
                                                <img src={ActiveCircle} className="pulse-icon" alt="Active" /> :
                                                <img src={InactiveCircle} alt="Disabled" />   
                                            }
                                        </div>
                                    </td>
                                    <td>{`${user.last_name}, ${user.first_name}`}</td>
                                    <td>
                                            <Badge
                                                type={(daysSinceDate(user?.start_date) < 0) ? "secondary" : "dark"}
                                                text={
                                                    (daysSinceDate(user?.start_date) < 0) ? 
                                                        `Not Started` :
                                                        `Day ${daysSinceDate(user?.start_date)}`
                                                }
                                                size="md"
                                                className="d-flex justify-content-center"
                                            />
                                    </td>
                                    <td></td>
                                    <td className="text-center">
                                            <Badge
                                                type={user.user_role}
                                                text={capitalizeString(user.user_role)}
                                                className="d-flex justify-content-center w-100"

                                            >
                                                
                                            </Badge>
                                    </td>
                                    <td className="text-end">
                                        <Button 
                                            className="px-4 text-dark"
                                            variant="outline-warning" 
                                            type="button" 
                                            size="sm"
                                            onClick={() => onEdit(user)}
                                        >
                                            <i className="bi bi-pencil-square mr-2"></i> Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>

            {(users.length === 0) && (
                <div className="text-muted text-center my-auto">
                    <p>No employees to show</p>
                </div>
            )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </>

    );
}