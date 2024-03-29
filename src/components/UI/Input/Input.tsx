import React from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'
import { Type } from './Type'
import { Errors } from './Errors'
import Styles from './Input.module.scss'
import { useTheme } from '../../../context/theme'

type Props = {
  label: string,
  type: Type,
  errorMessage?: (string | undefined),
  default?: (string | number),

  register: any,
  name: string,
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: any) => void,
  validation?: string[],
}

const Input: React.FC<Props> = (props) => {
  let errorsObj: Record<string, any> = {};

  (props.validation || []).forEach((err) => {
    const [errName, value] = err.split(':')

    if (Errors[errName]) {
      if (value) {
        errorsObj = {
          ...errorsObj,
          ...Errors[errName](value),
        }
      } else {
        errorsObj = {
          ...errorsObj,
          ...Errors[errName](),
        }
      }
    }
  })

  const theme = useTheme()

  return (
    <div>
      <FloatingLabel
        controlId={props.name}
        label={props.label}
        className={`${Styles.container} mb-1`}
      >
        <Form.Control
          defaultValue={props?.default ? props.default : ''}
          type={props.type}
          placeholder={props.label}
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.color,
          }}
          {...props.register(props.name, {
            onChange: props.onChange,
            ...errorsObj,
          })}
        />
      </FloatingLabel>
      <span className="text-danger">
        {props?.errorMessage }
      </span>
    </div>
  )
}

Input.defaultProps = {
  validation: [],
  errorMessage: undefined,
  default: undefined,
  onChange: () => {},
}

export default Input
