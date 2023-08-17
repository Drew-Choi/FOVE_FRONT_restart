import React, {
  CSSProperties,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
} from 'react';

// type
interface TextArea_Custom extends PropsWithChildren {
  inputref?: MutableRefObject<HTMLTextAreaElement | null>;
  name?: string;
  placeholder?: string;
  onChangeEvent?: (e?: any) => void | Dispatch<SetStateAction<any>>;
  value?: string;
  onClickEvent?: (e?: any) => void | Dispatch<SetStateAction<any>>;
  maxLength?: number;
  cols?: number;
  rows?: number;
  styleArea?: CSSProperties;
  styleChildren?: CSSProperties;
  textAreaClassName?: string;
}

export default function TextArea_Custom({
  children,
  inputref,
  name,
  placeholder,
  onChangeEvent,
  value,
  onClickEvent,
  maxLength,
  cols,
  rows,
  styleArea,
  styleChildren,
  textAreaClassName,
}: TextArea_Custom) {
  return (
    <div>
      <p style={styleChildren}>{children}</p>
      <textarea
        // input 값을 ref로 보내기
        style={styleArea}
        ref={inputref}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChangeEvent}
        onClick={onClickEvent}
        maxLength={maxLength}
        cols={cols}
        rows={rows}
        className={textAreaClassName}
      />
    </div>
  );
}
