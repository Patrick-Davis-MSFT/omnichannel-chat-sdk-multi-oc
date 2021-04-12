import React from "react";
import { X } from "react-feather";
import './TransferButton.css';

interface TransferProps {
    buttonString: string;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    hide: boolean
}

function TransferButton(props: TransferProps) {
    if (!props.hide) {
        return (
            <div className="transferButton-header"  onClick={props.onClick}>
                <span> {props.buttonString} </span>
            </div>
        );
    }
    else { return null; }
}

export default TransferButton;