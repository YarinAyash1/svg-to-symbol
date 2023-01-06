import Highlight from "react-highlight/src";
import {useState} from "react";
import {Button} from "react-bootstrap";
import 'highlight.js/styles/default.css'
function CodeSnippet({snippet}) {
    const [show, setShow] = useState(false);

    return (
        <>
            {
                show ? (
                    <Highlight language="xml" className={'html'}>
                        {snippet}
                    </Highlight>
                ) : null

            }

            <Button onClick={() => setShow(!show)}>{!show ? 'Show Code' : 'Hide Code'}</Button>
        </>
    );
}

export default CodeSnippet
