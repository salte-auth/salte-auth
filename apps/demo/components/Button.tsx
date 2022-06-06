import classnames from 'classnames';
import styles from './Button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: React.ElementType;
  onClick?: () => void;
  [key: string]: any;
};

export function Button({
  children,
  className,
  disabled,
  type: Type = 'button',
  onClick,
  ...extraProps
}: ButtonProps) {
  return (
    <Type
      className={classnames(
        styles.button,
        disabled && styles.disabled,
        className,
      )}
      onClick={() => {
        if (disabled) return;

        onClick();
      }}
      {...extraProps}
    >
      {children}
    </Type>
  )
}
