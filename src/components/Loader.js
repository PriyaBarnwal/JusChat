import React from 'react'
import PulseLoader from "react-spinners/PulseLoader"
import FadeLoader from "react-spinners/FadeLoader"
import '../styles/Loader.css'

export const BubbleLoader = () => {
  return (
    <div className="container">
      <PulseLoader
        color={"#fff"}
        loading={true}
      />
      <span className="loader-text">Loading...</span>
    </div>
  )
}

export const ImageLoader = () => {
  return (
    <FadeLoader
      color="black"
      loading={true}
    />
  )
}