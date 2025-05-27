"use client";

import useModel from "@/hooks/useModel";
import {
  AppendSceneAsync,
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  MeshBuilder,
  PointerEventTypes,
  Scene,
  Vector3,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF";
import { useEffect, useRef, useState } from "react";
import styles from "./BabylonCanvas.module.css";

interface props {
  className?: string;
}

const BabylonCanvas = ({ className }: props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { model } = useModel();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    console.log(canvas);
    if (!canvas) return;

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      5,
      Vector3.Zero(),
      scene
    );

    // マウス操作を可能にする
    camera.attachControl(canvas, true);

    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    
    scene.clearColor = new Color4(1,1,1,1);

    // MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERDOWN:
        setIsDragging(true);
        break;
      case PointerEventTypes.POINTERUP:
        setIsDragging(false);
        break;
    }
  });

    const focusCameraOnSceneMeshes = (
      camera: ArcRotateCamera,
      scene: Scene
    ) => {
      const meshes = scene.meshes;
      if (meshes.length <= 0) return;

      let min = new Vector3(
        Number.MAX_VALUE,
        Number.MAX_VALUE,
        Number.MAX_VALUE
      );
      let max = new Vector3(
        -Number.MAX_VALUE,
        -Number.MAX_VALUE,
        -Number.MAX_VALUE
      );

      meshes.forEach((mesh) => {
        if (!mesh.getBoundingInfo) return;

        const boundingInfo = mesh.getBoundingInfo();
        const boundingBox = boundingInfo.boundingBox;

        min = Vector3.Minimize(min, boundingBox.minimumWorld);
        max = Vector3.Maximize(max, boundingBox.maximumWorld);
      });

      const center = Vector3.Center(min, max);
      const size = max.subtract(min);

      camera.position = new Vector3(
        center.x + size.x * 2,
        center.y,
        center.z + size.z * 2
      );
      camera.setTarget(center);
      // camera.radius = size.x * 2;

      // console.log(center, size * 2, meshes);
    };

    const appendModel = async () => {
      if (typeof model !== "string") return;
      await AppendSceneAsync(model, scene);
      focusCameraOnSceneMeshes(camera, scene);
    };

    appendModel();

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      engine.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [model]);

  return (
    <div
      className={`${styles.BabylonCanvasWrapper}`}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <canvas
        ref={canvasRef}
        className={`${styles.BabylonCanvas} ${className ? `${className}` : ""}`}
      />
    </div>
  );
};

export default BabylonCanvas;
