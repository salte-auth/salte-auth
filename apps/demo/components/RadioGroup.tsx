import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './RadioGroup.module.scss';

export type RadioGroupOptions = {
  [key: string]: string;
};

type RadioGroupProps = {
  name: string;

  options?: RadioGroupOptions;

  value?: string;

  className?: string;
  optionsClassName?: string;

  onChange: (value: string, oldValue?: string) => void;
}

export function RadioGroup({
  name,
  options,
  value,
  className,
  optionsClassName,
  onChange
}: RadioGroupProps) {
  const [_value, _setValue] = useState<string|null>(null);

  useEffect(() => {
    _setValue(value);
  }, [value]);

  return (
    <div className={classNames(
      styles.radioGroup,
      className,
    )}>
      <b>Providers</b>
      <div className={optionsClassName}>
        {options && Object.entries(options).map(([key, label]) => (
          <div key={key}>
            <input
              type="radio"
              id={key}
              name={name}
              value={key}
              checked={key === _value}
              onChange={(event) => {
                const newValue = event.target.value;
                onChange(newValue, _value);

                _setValue(newValue);
              }}
            />
            <label htmlFor={key}>{label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
