import { 
    Popover as BootstrapPopover,
    type PopoverProps as BootstrapPopoverProps
} from "react-bootstrap";
import  { forwardRef } from "react";

interface PopoverProps extends BootstrapPopoverProps {
    title: string;
    body_text: string;
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    function Popover({title, body_text, ...props}, ref) {
        return (
            <BootstrapPopover id="popover-basic" ref={ref} {...props}>
                <BootstrapPopover.Header as="h3">{title}</BootstrapPopover.Header>
                <BootstrapPopover.Body>
                    {body_text}
                </BootstrapPopover.Body>
            </BootstrapPopover>
        );
    }
);

export default Popover;