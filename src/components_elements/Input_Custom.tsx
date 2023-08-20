import React, {
  CSSProperties,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
} from 'react';

// type
interface Input_CustomType extends PropsWithChildren {
  inputref?: MutableRefObject<HTMLInputElement | null>;
  type?: string;
  name?: string;
  placeholder?: string;
  onChangeEvent?: (e?: any) => (void | any) | Dispatch<SetStateAction<any>>;
  value?: string;
  onClickEvent?: (e?: any) => (void | any) | Dispatch<SetStateAction<any>>;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  classNameInput?: string;
  classNameDiv?: string;
  classNameP?: string;
  maxLength?: number;
  checked?: boolean;
  divStyle?: CSSProperties;
  pStyle?: CSSProperties;
  inputStyle?: CSSProperties;
}

// 라디오는 name으로 통일 시켜줘야함
export default function Input_Custom({
  children,
  inputref,
  type,
  name,
  placeholder,
  onChangeEvent,
  value,
  onClickEvent,
  multiple,
  accept,
  disabled,
  classNameInput,
  classNameDiv,
  classNameP,
  maxLength,
  checked,
  pStyle,
  divStyle,
  inputStyle,
}: Input_CustomType) {
  return (
    <div className={classNameDiv} style={divStyle}>
      <p className={classNameP} style={pStyle}>
        {children}
      </p>
      <input
        style={inputStyle}
        ref={inputref}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChangeEvent}
        onClick={onClickEvent}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        className={classNameInput}
        maxLength={maxLength}
        checked={checked}
      />
    </div>
  );
}

Input_Custom.defaultProps = {
  divStyle: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pStyle: { display: 'inline', marginRight: '5px', marginBottom: '0' },
  type: 'text',
};
