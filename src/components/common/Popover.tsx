import { 
    Popover as BootstrapPopover,
    type PopoverProps as BootstrapPopoverProps
} from "react-bootstrap";
import  { forwardRef } from "react";

interface PopoverProps extends BootstrapPopoverProps {
    title?: string;
    body_text: string;
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    function Popover({title, body_text, ...props}: PopoverProps, ref) {
        return (
            <BootstrapPopover id="popover-basic" ref={ref} {...props}>
                {
                    title && 
                    <BootstrapPopover.Header 
                        as="h3" 
                        className="p-2"
                    >
                        {title}
                    </BootstrapPopover.Header>
                }
                <BootstrapPopover.Body className="p-2">
                    {body_text}
                </BootstrapPopover.Body>
            </BootstrapPopover>
        );
    }
);

export default Popover;