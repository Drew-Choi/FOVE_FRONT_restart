import React, {
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
  onChangeEvent?: (e?: any) => void | Dispatch<SetStateAction<any>>;
  value?: string;
  onClickEvent?: (e?: any) => void | Dispatch<SetStateAction<any>>;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  classNameNew?: string;
  classNameDiv?: string;
  maxLength?: number;
}

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
  classNameNew,
  classNameDiv,
  maxLength,
}: Input_CustomType) {
  return (
    <div className={classNameDiv}>
      <p>{children}</p>
      <input
        // input 값을 ref로 보내기
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
        className={classNameNew}
        maxLength={maxLength}
      />
    </div>
  );
}
