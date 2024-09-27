import { Button } from "./ui/button"
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faSpinner } from '@fortawesome/free-solid-svg-icons'

interface ButtonProps {
    isLoading: boolean,
    className?: string,
    children: React.ReactNode,
}

function SubmitButton( {isLoading, className, children }: ButtonProps) {
  return (
    <Button type="submit" disabled={isLoading} className={className ?? 'shad-primary-btn w-full rounded'}>

        { isLoading ? (
            <div className="flex items-center gap-4">
                <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
                Loading
            </div>
        ): children}

    </Button>
  )
}

export default SubmitButton
