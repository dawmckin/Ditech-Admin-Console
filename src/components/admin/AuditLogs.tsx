import { Accordion, Card, Col, Row, Table } from "react-bootstrap";
import Badge, { type BadgeType } from "../common/Badge";
import { useSelectAuditLogs } from "../../hooks/useSelectAuditLogs";
import formatDateTime from "../../utils/format-date-time";
import type { AuditLog } from "../../types/AuditLog";
import { useState, type ReactNode } from "react";
import type { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";

export default function AuditLogs() {
    const [activeAccordion, setActiveAccordion] = useState<AccordionEventKey | null>(null);

    const {auditLogs, loading, error} = useSelectAuditLogs();

    const renderAuditLogDetails = (log: AuditLog): ReactNode => {
        switch(log.action_type) {
            case 'user_created':
                return (
                    <div className="">
                        <p className="mb-2 fw-semibold">{log.description}</p>
                        <p className="mb-1">Role: {log.new_data?.user_role as string}</p>
                        <p className="mb-1">Start Date: {formatDateTime(log.new_data?.start_date as string, true)}</p>
                        <p className="mb-1">Performed By: {`${log.actor?.first_name} ${log.actor?.last_name} (${log?.actor?.user_role})`}</p>
                    </div>
                );            
            case 'user_updated':
                return (
                    <div className="">
                        <p className="mb-2 fw-semibold">{log.description}</p>
                        <p className="mb-1">Performed By: {`${log.actor?.first_name} ${log.actor?.last_name} (${log?.actor?.user_role})`}</p>

                        <Accordion className="details-accordion mt-2 mb-1"
                            activeKey={activeAccordion}
                            onSelect={(eventKey) => {
                                setActiveAccordion(eventKey);
                            }}
                        >
                            <Accordion.Item eventKey={log.audit_id} className="mx-0">
                                <Accordion.Header>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex">
                                            <i className="bi bi-clipboard2-data"></i>
                                            
                                            <div className="my-auto mx-2">
                                                <p className="mb-0 fw-semibold" style={{fontSize: '.8rem'}}>Details</p>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body className="px-3 py-0" style={{overflowX: 'auto'}}>
                                    <Table size="sm">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th><small style={{padding: '0 .8rem'}}>old_data</small></th>
                                                <th></th>
                                                <th><small style={{padding: '0 .8rem'}}>new_data</small></th>
                                            </tr>
                                        </thead>
                                        <tbody style={{fontSize: '.75rem'}}>
                                            {
                                                Object.entries(log?.new_data ?? {}).map(data => (
                                                    <tr>
                                                        <td>{data[0]}</td>
                                                        <td>
                                                            <Badge
                                                                type="details_value"
                                                                text={log?.old_data ? 
                                                                        log?.old_data[data[0]] as string ?? 'null' : 
                                                                        ''
                                                                    }
                                                                className="rounded-1 w-100"
                                                            />

                                                        </td>
                                                        <td><i className="bi bi-arrow-right-square-fill text-primary"></i></td>
                                                        <td>
                                                            <Badge
                                                                type="details_value"
                                                                text={log?.new_data ?
                                                                    data[1] as string ?? 'null' :
                                                                    ''
                                                                }
                                                                className="rounded-1 w-100"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                );
            case 'review_submitted':
                return (
                    <div className="">
                        <p className="mb-2 fw-semibold">{log.description}</p>
                        <p className="mb-1">Milestone: {log?.new_data?.milestone as string}_day</p>
                        <p className="mb-1">Status: {log?.new_data?.review_status as string}</p>
                        <p className="mb-1">Total Score: {log?.new_data?.total_score as string}</p>
                        <p className="mb-1">Reviewed By: {`${log.actor?.first_name} ${log.actor?.last_name} (${log?.actor?.user_role})`}</p>
                    </div>
                );
            default:
                // user disabled, user enabled
                return (
                    <div className="">
                        <p className="mb-2 fw-semibold">{log.description}</p>
                        <p className="mb-1">Performed By: {`${log.actor?.first_name} ${log.actor?.last_name} (${log?.actor?.user_role})`}</p>
                    </div>
                );
            
        }

    }

    return (
        <div className="p-4">
            <h4>Audit Logs</h4>
            <small className="text-muted">Track all updates and changes to the application</small>
            <hr />
            <div className="audit-log-container d-flex flex-column gap-3">
                {
                    (!loading) ? (
                        auditLogs.map(log => (
                            <Card className="audit-log-card border-0 shadow-sm rounded-4 p-3">
                                <Card.Body className="p-0">
                                    <Row className="g-3">
                                        <Col md={2}>
                                            <Badge type={log.action_type as BadgeType} />
                                        </Col>

                                        <Col md={7} style={{fontSize: '.8rem'}}>
                                            {renderAuditLogDetails(log)}
                                            <small className="text-muted">Logged On: {formatDateTime(log.created_at)}</small>
                                        </Col>

                                        <Col md={3}>
                                            <div className="d-flex justify-content-end" style={{fontSize: '.8rem'}}>
                                                <small className="text-muted">Audit_Log.{log?.audit_id}</small>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <div className="text-muted text-center my-auto">
                            <p className="">Loading audit logs...</p>
                        </div>
                    )
                }
                {(!loading && auditLogs.length === 0) && (
                    <div className="text-muted text-center my-auto">
                        <p>No logs to show</p>
                    </div>
                )}
            </div>

        </div>
    )
}