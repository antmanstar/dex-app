import React, { useState } from 'react'
import Chart from 'kaktana-react-lightweight-charts'
import { Flex } from '@pancakeswap/uikit'


export const SwapChart = () => {

  const [ options, setOptions ] = useState({
    options: {
      alignLabels: true,
      timeScale: {
        rightOffset: 12,
        barSpacing: 3,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: true,
        borderColor: "#2b2b43",
        visible: true,
        timeVisible: true,
        secondsVisible: false,
        background: "transparent"
      },
      // crosshair: {
      //   vertLine: {
      //     visible: false,
      //     // labelVisible: false,
      //   },
      //   horzLine: {
      //     visible: false,
      //     // labelVisible: true,
      //   },
      //   // mode: 1,
      // },
      grid: {
        vertLines: {
          // color: 'rgba(70, 130, 180, 0.5)',
          // style: 1,
          visible: false,
        },
        horzLines: {
          // color: 'rgba(70, 130, 180, 0.5)',
          // style: 1,
          visible: false,
        },
      },
      layout: {
        backgroundColor: 'transparent',
        textColor: '#5778c4',
        fontSize: 12,
        fontFamily: 'Poppins',
      },
      priceScale: {
        position: 'left',
        color: 'white',
        borderColor: "#2b2b43",
        scaleMargins: {
          top: 0.30,
          bottom: 0.25,
        },
      },
    },
    candlestickSeries: [{
      data: [
        { time: '2021-10-10', open: 180.34, high: 180.99, low: 178.57, close: 179.85 },
        { time: '2021-10-12', open: 180.82, high: 181.40, low: 177.56, close: 178.75 },
        { time: '2021-10-13', open: 175.77, high: 179.49, low: 175.44, close: 178.53 },
        { time: '2021-10-14', open: 178.58, high: 182.37, low: 176.31, close: 176.97 },
        { time: '2021-10-15', open: 177.52, high: 180.50, low: 176.83, close: 179.07 },
        { time: '2021-10-16', open: 176.88, high: 177.34, low: 170.91, close: 172.23 },
        { time: '2021-10-17', open: 173.16, high: 176.43, low: 172.64, close: 176.24 },
        { time: '2021-10-18', open: 177.98, high: 178.85, low: 175.59, close: 175.88 },
        { time: '2021-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85 },
        { time: '2021-10-22', open: 180.82, high: 181.40, low: 177.56, close: 178.75 },
        { time: '2021-10-23', open: 175.77, high: 179.49, low: 175.44, close: 178.53 },
        { time: '2021-10-24', open: 178.58, high: 182.37, low: 176.31, close: 176.97 },
        { time: '2021-10-25', open: 177.52, high: 180.50, low: 176.83, close: 179.07 },
        { time: '2021-10-26', open: 176.88, high: 177.34, low: 170.91, close: 172.23 },
        { time: '2021-10-29', open: 173.74, high: 175.99, low: 170.95, close: 173.20 },
        { time: '2021-10-30', open: 173.16, high: 176.43, low: 172.64, close: 176.24 },
        { time: '2021-10-31', open: 177.98, high: 178.85, low: 175.59, close: 175.88 },
        { time: '2021-11-01', open: 176.84, high: 180.86, low: 175.90, close: 180.46 },
        { time: '2021-11-02', open: 180.82, high: 181.40, low: 177.56, close: 178.75 },
        { time: '2021-11-03', open: 175.77, high: 179.49, low: 175.44, close: 178.53 },
        { time: '2021-11-04', open: 178.58, high: 182.37, low: 176.31, close: 176.97 },
        { time: '2021-11-05', open: 177.52, high: 180.50, low: 176.83, close: 179.07 },
        { time: '2021-11-06', open: 176.88, high: 177.34, low: 170.91, close: 172.23 },
        { time: '2021-11-08', open: 182.47, high: 183.01, low: 177.39, close: 175.93 },
        { time: '2021-11-09', open: 173.74, high: 175.99, low: 170.95, close: 173.20 },
        { time: '2021-11-10', open: 173.16, high: 176.43, low: 172.64, close: 176.24 },
        { time: '2021-11-11', open: 177.98, high: 178.85, low: 175.59, close: 175.88 },
      ]
    }],
    // areaSeries: [{
    //   data: [
    //     { time: '2021-12-22', value: 32.51 },
    //     { time: '2021-12-23', value: 31.11 },
    //     { time: '2021-12-24', value: 27.02 },
    //     { time: '2021-12-25', value: 27.32 },
    //     { time: '2021-12-26', value: 25.17 },
    //     { time: '2021-12-27', value: 28.89 },
    //     { time: '2021-12-28', value: 25.46 },
    //     { time: '2021-12-29', value: 23.92 },
    //     { time: '2021-12-30', value: 22.68 },
    //     { time: '2021-12-31', value: 22.67 },
    //     { time: '2021-12-2', value: 32.51 },
    //     { time: '2021-12-3', value: 31.11 },
    //     { time: '2021-12-4', value: 27.02 },
    //     { time: '2021-12-5', value: 27.32 },
    //     { time: '2021-12-6', value: 25.17 },
    //     { time: '2021-12-7', value: 28.89 },
    //     { time: '2021-12-8', value: 25.46 },
    //     { time: '2021-12-9', value: 23.92 },
    //     { time: '2021-12-10', value: 22.67 },
    //     { time: '2021-12-11', value: 32.51 },
    //     { time: '2021-12-13', value: 31.11 },
    //     { time: '2021-12-14', value: 27.02 },
    //     { time: '2021-12-15', value: 27.32 },
    //     { time: '2021-12-16', value: 25.17 },
    //     { time: '2021-12-17', value: 28.89 },
    //     { time: '2021-12-18', value: 25.46 },
    //     { time: '2021-12-19', value: 23.92 },
    //     { time: '2021-12-20', value: 22.68 },
    //     { time: '2021-12-21', value: 22.67 },
    //     { time: '2021-12-22', value: 32.51 },
    //     { time: '2021-12-23', value: 31.11 },
    //     { time: '2021-12-24', value: 27.02 },
    //     { time: '2021-12-25', value: 27.32 },
    //     { time: '2021-12-26', value: 25.17 },
    //     { time: '2021-12-27', value: 28.89 },
    //     { time: '2021-12-28', value: 25.46 },
    //     { time: '2021-12-29', value: 27.92 },
    //     { time: '2021-12-30', value: 28.68 },
    //     { time: '2021-12-31', value: 32.67 },
    //     { time: '2022-01-01', value: 33.67 },
    //     { time: '2022-01-02', value: 32.67 },
    //   ]
    // }]
  })



  return (
    <Flex mt="40px" ml="-8px">
      <Chart options={options.options} candlestickSeries={options.candlestickSeries} autoWidth height={320} />
    </Flex>
  )
}
