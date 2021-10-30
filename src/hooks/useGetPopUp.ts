import { useEffect, useState } from 'react'
import { useWidth } from './useWidth'

export const useGetPopUp = (): boolean => {
  const [showPopUp, setPopup] = useState(false)
  const width = useWidth()

  useEffect(() => {
    if (width < 481) {
      setPopup(true)
    }

    if (width > 480) {
      setPopup(false)
    }
  }, [width])

  return showPopUp
}
