import React from "react"
import { Wave } from "../../types"
import "./WavesTable.css"

type WavesTableProps = {
  waves: Wave[]
}

const WavesTable = ({ waves }: WavesTableProps) => {
  return (
    <>
      <table className="table">
        <thead className="thead">
          <tr className="tr">
            <th className="th">Address</th>
            <th className="th">Time</th>
            <th className="th">Message</th>
          </tr>
        </thead>
        <tbody>
          {waves.map((wave, index) => (
            <tr key={`${wave.address}-${index}`} className="tr">
              <td className="td">{wave.address}</td>
              <td className="td">{wave.timestamp.toString()}</td>
              <td className="td">{wave.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default WavesTable
