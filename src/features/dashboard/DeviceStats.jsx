import PropTypes from "prop-types";
import { HiCog, HiBattery100, HiShieldCheck } from "react-icons/hi2";
import { LuListChecks } from "react-icons/lu";
function DeviceStats({ devices }) {
  const totalDevicesNum = devices.total;

  const energizedDeviceNum = devices.energized;

  const PFPTDeviceNum = devices.pfpt;
  const TaskForThisWeek = devices.task_for_this_week;
  const divStyleCom =
    "grid grid-cols-[6.4rem_1fr] grid-rows-[auto_auto] gap-2 items-center  rounded-full bg-white p-4 ";
  const iconStyle = "text-6xl row-span-full ";
  const numberStyle = "text-6xl font-semibold ";
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center gap-6 mb-4 ">
      <div className={divStyleCom}>
        <HiCog className={iconStyle} />
        <p>Total Device</p>
        <p className={numberStyle}>{totalDevicesNum}</p>
      </div>

      <div className={divStyleCom}>
        <HiBattery100 className={iconStyle + " text-green-500"} />
        <p>Energized</p>
        <p className={numberStyle}>{energizedDeviceNum}</p>
      </div>
      <div className={divStyleCom}>
        <HiShieldCheck className={iconStyle + " text-green-500"} />
        <p>PFPT</p>
        <p className={numberStyle}>{PFPTDeviceNum}</p>
      </div>
      <div className={divStyleCom}>
        <LuListChecks className={iconStyle + " text-orange-500"} />
        <p>Week Tasks</p>
        <p className={numberStyle}>{TaskForThisWeek}</p>
      </div>
    </div>
  );
}
DeviceStats.propTypes = { devices: PropTypes.any };
export default DeviceStats;
