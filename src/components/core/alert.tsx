import * as React from "react";
import { Alert, Collapse, IconButton } from '@mui/material';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';

interface PopUpProps {
    open: boolean;
    alertSeverity: 'error' | 'success';
    alertMessage: string;
}

export function PopUp({ open, alertSeverity, alertMessage }: PopUpProps): React.JSX.Element {
    const [isOpen, setIsOpen] = React.useState(open);

    React.useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20}}>
            <Collapse in={isOpen}>
                <Alert
                    severity={alertSeverity}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {alertMessage}
                </Alert>
            </Collapse>
        </div>
    );
}
