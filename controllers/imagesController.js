const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const path = require("path");

const ErrorResponse = require("../utils/errorResponse");

// @desc    Upload cow image
// @route   POST /api/v1/cows/:cowId/images
// @access  Private
exports.cowPhotoUpload = asyncHandler(async (req, res, next) => {
  const cow = await prisma.Cows.findUnique({
    where: { id: Number(req.params.cowId) },
  });

  if (!cow) {
    return next(
      new ErrorResponse(`Cow not found with id of ${req.params.cowId}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  console.log(req.files);
  const file = req.files.file;
  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Ukuran foto maksimal ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${cow.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await prisma.Images.create({
      data: {
        cow_id: Number(req.params.cowId),
        url: file.name,
      },
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
