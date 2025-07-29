import React, { useState } from "react";
import { useUnit } from "effector-react";
import { Paper, Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { theme } from "../shared/theme";
import { searchAppModel } from "models";

export const ExcelFileDropZone = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const uploadedFile = useUnit(searchAppModel.$uploadedExcelFile);
  const excelTagsCount = useUnit(searchAppModel.$excelTagsCount);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      searchAppModel.parseExcelFileChanged(file);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        flexGrow: 1,
        p: 1,
        border: `2px dashed ${
          isDragOver ? theme.palette.primary.main : theme.palette.grey[400]
        }`,
        backgroundColor: isDragOver
          ? theme.palette.action.hover
          : "transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.primary.main,
        },
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CloudUploadIcon
          sx={{ fontSize: 48, color: theme.palette.grey[500] }}
        />
        {uploadedFile ? (
          <>
            <Typography variant="body1" color="primary">
              {uploadedFile.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Тегов: {excelTagsCount}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1" color="textPrimary">
              Перетащите Excel файл сюда или нажмите для выбора
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Поддерживаются форматы: .xlsx, .xls
            </Typography>
          </>
        )}
        <Button
          variant="text"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            searchAppModel.downloadExcelTemplateClicked();
          }}
        >
          Скачать шаблон
        </Button>
      </Box>
      <input
        id="file-input"
        type="file"
        accept=".xlsx,.xls"
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
    </Paper>
  );
};
