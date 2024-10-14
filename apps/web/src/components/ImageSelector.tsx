import React from "react"
import ImgCrop from "antd-img-crop"

import { Upload } from "antd"
import { FileType } from "../lib/types"
import { UploadFile, UploadProps } from "antd"
import { Dispatch, SetStateAction, useState } from "react"

interface ImageSelectorProps {
	imageLabel: string
	setImageFile?: Dispatch<SetStateAction<UploadFile | null>>
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ imageLabel, setImageFile }) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])

	console.log(setImageFile)

	const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
		setFileList(newFileList)
	}

	const beforeUpload = (file: FileType) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)

		if (setImageFile) reader.onload = () => setImageFile(file)

		setFileList([fileList.shift() as UploadFile])
		return false
	}

	return (
		<ImgCrop rotationSlider modalTitle="Editar imagen" modalOk="Confirmar" modalCancel="Cancelar">
			<Upload
				fileList={fileList}
				beforeUpload={beforeUpload}
				onChange={onChange}
				showUploadList={true}
				listType="text"
				accept=".jpg,.jpeg,.png,.webp"
			>
				<div className="flex flex-col gap-2 w-full">
					<p className="font-semibold text-dark dark:text-light text-base">{imageLabel}</p>

					<div className="flex flex-row justify-center w-full rounded-lg cursor-pointer">
						<div className="flex flex-col gap-1">
							<p className="text-gray-dark dark:text-gray-light">Haga click para subir una imagen</p>
							<p className="text-gray-dark dark:text-gray-light">
								Formatos permitidos: .jpg, .jpeg, .png .webp
							</p>
						</div>
					</div>
				</div>
			</Upload>
		</ImgCrop>
	)
}
