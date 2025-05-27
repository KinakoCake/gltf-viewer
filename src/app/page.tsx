"use client";

import React from "react";
import BabylonCanvas from "@/components/BabylonCanvas";
import styles from "./page.module.css";
import useModel from "@/hooks/useModel";

export default function Home() {
  const { setModel } = useModel();
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files.length <= 0) return;

    const file = files[0];
    const isGltf = file.name.endsWith(".gltf") || file.name.endsWith(".glb");

    if (!isGltf) return;

    const reader = new FileReader();

    if (file.name.endsWith(".gltf")) {
      
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          const gltfString = JSON.stringify(json, null, 4);
          setModel({ type: "gltf", model: gltfString });
        } catch (err) {
          console.error("JSON parse error");
        }
      };
      // gltf形式として読み込む
      reader.readAsText(file);
    } else if (file.name.endsWith(".glb")) {
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setModel({ type: "glb", model: result });
        }
      };
      // glbをbase64として読み込む
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${styles.app}`}>
      <div className={`${styles.appName} ${styles.panel}`}>
        <h3>glTF Viewer</h3>
      </div>
      <div className={`${styles.split}`}>
        <div
          className={`${styles.panel}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h3>Input</h3>
          <p>
            埋め込み形式（Data URI）の .gltf または .glb ファイルをここにドロップしてください
          </p>
          <div className={`${styles.dropArea}`}>
            <span>Drop here (.gltf or .glb)</span>
          </div>
        </div>
        <div className={`viewer ${styles.panel}`}>
          <h3>Viewer</h3>
          <p>読み込まれたモデルがこちらに表示されます</p>
          <BabylonCanvas />
        </div>
      </div>
    </div>
  );
}
