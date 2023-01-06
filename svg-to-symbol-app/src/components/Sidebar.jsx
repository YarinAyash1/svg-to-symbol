import {Button, Form} from "react-bootstrap";
import IconSend from "./icons/SendIcon.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {buildHtml, getSampleSVG, getUuid} from "../helper.js";
import axios from "axios";
import {ResultsContext} from "../context.jsx";

function Sidebar() {
    const {results, setResults} = useContext(ResultsContext);
    const [textArea, setTextArea] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmittedStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const loadSampleSVG = () => {
        setTextArea(getSampleSVG)
        setSubmittedStatus(true);
    }

    useEffect(() => {
        if (!submitted) return;

        handleSubmit();

        return setSubmittedStatus(false)
    }, [submitted])


    useEffect(() => {

    }, [])

    const handleSubmit = (event) => {
        if (event) event.preventDefault();

        setIsLoading(true);
        axios.post('http://localhost:5000/api/v1/convert-to-symbol', {svgData: textArea}, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        })
            .then(onSuccess)
            .catch(() => {
                setErrorMessage('Error!')
                setIsLoading(false);
            });
    };

    function onSuccess(response) {
        const uuid = getUuid();
        const svg = response.data.input;
        const compiledSamples = buildHtml(response.data.symbol, uuid);

        setResults((prevState) => [{
            svg,
            symbol: compiledSamples.symbol,
            icon: compiledSamples.icon,
            codeSample: compiledSamples.htmlExample,
            time: new Date()
        }, ...prevState]);

        setErrorMessage('')
        setTextArea('')
        setIsLoading(false);
        localStorage.setItem('svg-to-symbol-converter', JSON.stringify(results));
    }


    return (
        <div className={'position-sticky top-0 pt-3 pe-5'}>
            <h1 className="title">SVG to Symbol Converter</h1>
            <p>
                This tools will help you to bring <a
                href="https://web.archive.org/web/20221024041235/https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol"
                rel="noopener">
                &lt;symbol&gt;
            </a> to your web pages.
            </p>
            <p>
                If you are wondering why is better to use symbols instead of SVGs then read <a
                href="https://web.archive.org/web/20221024041235/https://css-tricks.com/svg-symbol-good-choice-icons/"
                rel="noopener">this article from CSS-Tricks</a>.
            </p>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="SVGTextArea">
                    <Form.Label>Convert SVG</Form.Label>
                    <Form.Control placeholder={'<svg>\n' + '  <!-- here the svg to convert... -->\n' + '</svg>'}
                                  onChange={(e) => setTextArea(e.target.value)}
                                  value={textArea}
                                  as="textarea" rows={12}/>
                </Form.Group>
                {errorMessage ? (<p>
                    {errorMessage}
                </p>) : null}
                <Button
                    type={'submit'}
                    variant="primary">
                    {isLoading ? 'Converting...' : 'Convert'} <IconSend/>
                </Button>{' '}
                <Button
                    onClick={loadSampleSVG}
                    variant="secondary">
                    or load a sample
                </Button>
            </Form>


        </div>
    );
}

export default Sidebar
