"use client";

import React, { useEffect, useRef } from "react";
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

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        console.log(result);
        setModel(result);
      }
    };

    // glTFをbase64として読み込む
    reader.readAsDataURL(file);
  };
  return (
    <div className={`${styles.app}`}>
      <div className={`${styles.appName} ${styles.panel}`}>
        <h3>GLTF Viewer</h3>
      </div>
      <div className={`${styles.split}`}>
        <div
          className={`${styles.panel}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h3>Input</h3>
          <p>
            .gltfファイルもしくは.glbファイルをドラッグ&ドロップしてください
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
