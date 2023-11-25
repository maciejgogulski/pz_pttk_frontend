import React from 'react'
import { FloatingLabel, Form } from 'react-bootstrap'

type Props = {
  label: string,
  options: Record<(string | number), (string | number)>,
  // TODO: improve data type
  errorMessage?: (string | undefined),
  default?: (string | number),

  name: string,
  register: any,
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: any) => void,
    sortOptions?: boolean
}

const Select: React.FC<Props> = (props) => {
  const sortedOptions = props.sortOptions
    ? Object.entries(props.options).sort((a, b) => String(a[1]).localeCompare(String(b[1])))
    : Object.entries(props.options)

  return (
    <div>
      <FloatingLabel controlId="floatingSelect" label={props.label}>
        <Form.Select
          aria-label="Floating label select example"
          onChange={props.onChange}
          {...props.register(props.name, {
            onChange: props.onChange,
          })}
        >
          {sortedOptions.map(([key, value]) => (
            <option
              key={value}
              value={key}
              selected={key.toString() === props.default?.toString()}
            >
              {value}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>

      <span className="text-danger">{props.errorMessage}</span>
    </div>
  )
}
Select.defaultProps = {
  errorMessage: undefined,
  default: '',
  onChange: () => {},
  sortOptions: false,
}

export default Select
