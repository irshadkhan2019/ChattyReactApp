import React from 'react'
import PropTypes from 'prop-types'
import { FaPlusCircle } from "react-icons/fa";
import Button from './Button'
import "./CreateRoomButton.scss"

const CreateRoomButton = props => {
  const createNewRoomHandler=()=>{
      console.log("createNewRoomHandler")
  }
  return (
    <Button
    handleClick={createNewRoomHandler}
    label={<FaPlusCircle></FaPlusCircle>}
    className={"room_btn"}

    />
 
  )
}

CreateRoomButton.propTypes = {}

export default CreateRoomButton