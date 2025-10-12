import "./index.css";
import SettingSvg from "../../assets/setting.svg?react";
import CloseSvg from "../../assets/close.svg?react";
import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import GlobalSettingForm from "./GlobalSettingForm";
import { message } from "../WMessage/message";

export default function GlobalSetting() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setShowForm(!showForm);
  };

  const handleSaveSuccess = () => {
    message.success({ content: "配置保存成功！", duration: 3 });
  };

  // 点击外部关闭
  useEffect(() => {
    if (!showForm) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setShowForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm]);

  return (
    <div className="global-setting" ref={formRef}>
      <motion.button
        className="btn-body"
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.25, ease: "linear" }}
        onClick={handleClick}
      >
        {showForm ? (
          <CloseSvg className="setting-icon" />
        ) : (
          <SettingSvg className="setting-icon" />
        )}
      </motion.button>

      <GlobalSettingForm show={showForm} onSaveSuccess={handleSaveSuccess} />
    </div>
  );
}
