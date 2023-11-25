import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

type Props = {
  title: string,
  message: string,
  action: () => void,
  variant: string,
  style?: React.CSSProperties,
}

const ModalComponent: React.FC<Props> = (props) => {
  const [show, setShow] = useState<boolean>(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const action = async () => {
    await props.action()
    handleClose()
  }

  return (
    <>
      <Button
        type="button"
        variant={props.variant}
        onClick={handleShow}
        style={props.style}
      >
        {props.title}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cofnij
          </Button>
          <Button variant={props.variant} onClick={action}>
            {props.title}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

ModalComponent.defaultProps = {
  style: {},
}

export default ModalComponent
