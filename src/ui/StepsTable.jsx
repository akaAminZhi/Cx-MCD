import Heading from "./Heading";
import { createContext, useContext, useState } from "react";
import Button from "./Button";

import PropTypes from "prop-types";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowSmallUp,
} from "react-icons/hi2";

const StepsTableContext = createContext();

function StepsTable({ children, testSteps }) {
  const [pfptStep, setPfptStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [records, setRecords] = useState([]);
  const [checkboxSelect, setCheckboxSelect] = useState([]);
  const [selectedSteps, setSelectedSteps] = useState(testSteps);
  //   console.log(selectedSteps);
  const numStep = selectedSteps?.length;
  const handleRadioChange = (e) => {
    setSelected(e.target.value);
  };

  const handleNext = () => {
    // 保存当前步骤的数据
    const currentRecord = {
      pfptStep,
      description: selectedSteps.at(pfptStep)?.description,
      selectedValue: selected,
    };
    // 更新记录，如果当前步骤已存在记录则替换
    setRecords((prevRecords) => {
      const newRecords = [...prevRecords];
      newRecords[pfptStep] = currentRecord;
      return newRecords;
    });
    // 前进到下一步（如果未到最后一步）
    if (pfptStep + 1 < numStep) {
      const nextStep = pfptStep + 1;
      setPfptStep(nextStep);

      // 如果下一步已有记录，恢复选中值；否则清空
      if (records[nextStep]) {
        setSelected(records[nextStep].selectedValue);
      } else {
        setSelected("");
      }
    }
  };

  const handlePrevious = () => {
    // 保存当前步骤的数据
    const currentRecord = {
      pfptStep,
      description: selectedSteps.at(pfptStep)?.description,
      selectedValue: selected,
    };
    // 更新记录，如果当前步骤已存在记录则替换
    setRecords((prevRecords) => {
      const newRecords = [...prevRecords];
      newRecords[pfptStep] = currentRecord;
      return newRecords;
    });
    if (pfptStep > 0) {
      const newStep = pfptStep - 1;
      setPfptStep(newStep);
      // 恢复上一步保存的选中值（如果有记录的话）
      if (records[newStep]) {
        setSelected(records[newStep].selectedValue);
      } else {
        setSelected("");
      }
    }
  };
  return (
    <StepsTableContext.Provider
      value={{
        handlePrevious,
        handleNext,
        handleRadioChange,
        pfptStep,
        selected,
        records,
        testSteps,
        selectedSteps,
        numStep,
        checkboxSelect,
        setCheckboxSelect,
        setSelectedSteps,
      }}
    >
      {children}
    </StepsTableContext.Provider>
  );
}

function TableHeading({ headingContent }) {
  const { pfptStep, numStep } = useContext(StepsTableContext);

  return (
    <div className="mb-5 grid justify-between gap-[1.2rem] grid-cols-[auto_auto] text-[1.8rem] ]">
      <Heading>{headingContent}</Heading>
      <div>
        {pfptStep + 1}/{numStep}
      </div>

      <progress
        className="progress-bar appearance-none w-full h-3 col-span-full"
        max={numStep}
        value={pfptStep + 1}
      ></progress>
    </div>
  );
}

function SubdevicesSelect() {
  const { testSteps, checkboxSelect, setCheckboxSelect, setSelectedSteps } =
    useContext(StepsTableContext);

  const uniqueStepsName = testSteps.filter(
    (step, index, self) =>
      index === self.findIndex((item) => item.name === step.name)
  );
  // 处理 checkbox 状态改变
  const handleCheckboxChange = (e, testStep) => {
    if (e.target.checked) {
      // 选中时，添加到选中列表中
      setCheckboxSelect((prev) => [...prev, testStep.name]);
    } else {
      // 取消选中时，从选中列表中过滤掉
      setCheckboxSelect((prev) =>
        prev.filter((name) => name !== testStep.name)
      );
    }
  };

  // 点击按钮时输出选中的值
  const handleConfirm = () => {
    console.log("选中的 checkbox id: ", checkboxSelect);
    // 可以在这里进一步处理 checkboxSelect
    // if (checkboxSelect.length === 0) return setSelectedSteps(testSteps);
    // console.log(testSteps);
    setSelectedSteps(() => {
      return testSteps.filter((item) =>
        checkboxSelect.some((keyword) => item.name.includes(keyword))
      );
    });
  };
  return (
    <div className="flex">
      <ul className="items-center justify-between w-full border-b  font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex ">
        {uniqueStepsName.map((testStep) => {
          return (
            <li key={testStep.id} className="  ">
              <div className="flex items-center ps-3">
                <input
                  id={testStep.id}
                  type="checkbox"
                  value={testStep.id}
                  className="w-10 h-10 text-blue-600 bg-gray-100 border-gray-300 rounded-sm "
                  onChange={(e) => handleCheckboxChange(e, testStep)}
                ></input>
                <label
                  htmlFor={testStep.id}
                  className="w-full py-3 ms-2 text-2xl font-medium"
                >
                  {testStep?.name}
                </label>
              </div>
            </li>
          );
        })}
        <Button onClick={() => handleConfirm()}>Comfirm</Button>
      </ul>
    </div>
  );
}

function TestSteps() {
  const { pfptStep, selectedSteps } = useContext(StepsTableContext);
  const paragraphs = selectedSteps?.at(pfptStep)?.description.split("\n");
  return (
    <div className="flex flex-col justify-center items-start text-3xl mb-2 mt-4 text-black bg-white p-2 rounded-2xl min-h-80 whitespace-pre-line ">
      {paragraphs?.map((para, index) => (
        <p key={index} className="mb-5">
          {para}
        </p>
      ))}
    </div>
  );
}

function ResultOptions() {
  const { handleRadioChange, selected } = useContext(StepsTableContext);
  const hoverAcition =
    "hover:scale-103 hover:cursor-pointer hover:font-bold  hover:shadow-lg hover:rounded-xl hover:ring-3 hover:ring-gray-500 hover:bg-gray-200 ";
  const activeAction =
    "active:scale-103 active:cursor-pointer active:font-bold  active:shadow-lg active:rounded-xl active:ring-3 active:ring-gray-500 ";

  const selectedAction =
    "has-checked:scale-103 has-checked:bg-indigo-50 has-checked:font-bold has-checked:text-indigo-900 has-checked:ring-indigo-200 has-checked:accent-indigo-600";
  return (
    <div className="grid grid-rows-3 gap-4 mt-10 bg-white rounded-3xl p-4 ">
      <label
        className={
          `flex justify-between items-center w-full p-2 border-2 border-gray-200 rounded-2xl text-5xl cursor-pointer   transition-colors duration-200  ` +
          hoverAcition +
          activeAction +
          selectedAction
        }
      >
        <span>Yes</span>
        <input
          className="w-10 h-10 mr-4"
          type="radio"
          name="answer"
          value="Yes"
          onChange={handleRadioChange}
          checked={selected === "Yes"}
        />
      </label>

      <label
        className={
          `flex justify-between items-center w-full p-2 border-2 border-gray-200 rounded-2xl text-5xl cursor-pointer   transition-colors duration-200  ` +
          hoverAcition +
          activeAction +
          selectedAction
        }
      >
        <span>No</span>
        <input
          className="w-10 h-10 mr-4"
          type="radio"
          name="answer"
          value="No"
          checked={selected === "No"}
          onChange={handleRadioChange}
        />
      </label>

      <label
        className={
          `flex justify-between items-center w-full p-2 border-2 border-gray-200 rounded-2xl text-5xl cursor-pointer   transition-colors duration-200  ` +
          hoverAcition +
          activeAction +
          selectedAction
        }
      >
        <span>N/A</span>
        <input
          className="w-10 h-10 mr-4"
          type="radio"
          name="answer"
          value="NA"
          checked={selected === "NA"}
          onChange={handleRadioChange}
        />
      </label>
    </div>
  );
}

function PreviousAndNextButton() {
  const { handlePrevious, handleNext, pfptStep, numStep } =
    useContext(StepsTableContext);
  return (
    <div className="mt-2 flex justify-between">
      <Button size="large" onClick={handlePrevious} disabled={pfptStep === 0}>
        <HiChevronLeft></HiChevronLeft>
        <span>Previous</span>
      </Button>
      {pfptStep !== numStep - 1 ? (
        <Button
          size="large"
          onClick={handleNext}
          disabled={pfptStep + 1 === numStep || numStep === 0}
        >
          <span>Next</span> <HiChevronRight></HiChevronRight>
        </Button>
      ) : (
        <Button size="large" variation="submitte">
          <span>Submit</span> <HiOutlineArrowSmallUp></HiOutlineArrowSmallUp>
        </Button>
      )}
    </div>
  );
}

TableHeading.propTypes = { headingContent: PropTypes.string };
StepsTable.propTypes = {
  children: PropTypes.node.isRequired,
  testSteps: PropTypes.any,
};
// SubdevicesSelect.propTypes = { handleFilterSteps: PropTypes.any };

StepsTable.TableHeading = TableHeading;
StepsTable.SubdevicesSelect = SubdevicesSelect;
StepsTable.TestSteps = TestSteps;
StepsTable.ResultOptions = ResultOptions;
StepsTable.PreviousAndNextButton = PreviousAndNextButton;
export default StepsTable;
