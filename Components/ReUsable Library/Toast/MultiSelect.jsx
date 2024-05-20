/* eslint-disable react/prop-types */
import classNames from 'classnames';
import './MultiSelect.css';

export default function MultiSelect({ options, multiSelectState, className='' }) {
    const [selectedOptions, setSelectedOptions] = multiSelectState;
    const finalClassName = classNames('customSelect', className);

    function handleChoose(option) {
        setSelectedOptions(prev =>
            (selectedOptions.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
        )
    }

    return (
        <div className={finalClassName}>
            {options.map((option, index) => (
                <div key={index} className="customOption">
                    <label>
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleChoose(option)}
                        />
                        <span className="customOptionText">{option}</span>
                    </label>
                </div>
            ))}
        </div>
    );
}
