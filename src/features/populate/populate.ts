import connectDB from "../../config/connect";
import SchoolModel from "../schools/schools.model";
import UserModel from "../users/users.model";
import TeacherModel from "../teachers/teachers.model";
import TeacherCoordinatorModel from "../teacher_coordinators/teacher_coordinators.model";
import FieldModel from "../fields/fields.model";
import TeacherFieldModel from "../teacher_fields/teacher_fields.model";
import ScheduleModel from "../schedules/schedule.model";
import BreakModel from "../breaks/breaks.model";
import LevelModel from "../levels/levels.model";
import GroupModel from "../groups/groups.Model";
import GroupCoordinatorModel from "../group_coordinators/group_coordinators.model";
import SubjectModel from "../subjects/subjects.model";
import SessionModel from "../sessions/sessions.model";

import entities from "./entities.json";

export const populate = async (index: number) => {
  try {
    await connectDB();

    /* CREATE SCHOOL */
    const school = await SchoolModel.create(entities.schools[index]);

    /* FIND SCHOOL */
    // const school = (await SchoolModel.find()).at(0);

    /* CREATE USER */
    // const school = (await SchoolModel.find()).at(0);
    const newCoordinator = school
      ? { ...entities.users[index][0], school_id: school._id }
      : null;
    const coordinator = await UserModel.create(newCoordinator);
    const newUser1 = school
      ? { ...entities.users[index][1], school_id: school._id }
      : null;
    const user1 = await UserModel.create(newUser1);
    const newUser2 = school
      ? { ...entities.users[index][2], school_id: school._id }
      : null;
    const user2 = await UserModel.create(newUser2);

    /* FIND USER */
    // const user = (await UserModel.find()).at(1);
    // const coordinator = (await UserModel.find()).at(0);

    /* CREATE TEACHER */
    // const user = (await UserModel.find()).at(1);
    // const coordinator = (await UserModel.find()).at(0);
    const newTeacher1 =
      user1 && coordinator
        ? {
            ...entities.teachers[0],
            school_id: user1.school_id,
            user_id: user1._id,
          }
        : null;
    const teacher1 = await TeacherModel.create(newTeacher1);
    const newTeacher2 =
      user2 && coordinator
        ? {
            ...entities.teachers[1],
            school_id: user2.school_id,
            user_id: user2._id,
          }
        : null;
    const teacher2 = await TeacherModel.create(newTeacher2);

    /* FIND TEACHER */
    // const teacher = (await TeacherModel.find()).at(0);

    /* CREATE TEACHER_COORDINATOR */
    // const teacher = (await TeacherModel.find()).at(0);
    // const user = (await FieldModel.find()).at(0);
    const teacherCoordinator1 = await TeacherCoordinatorModel.create({
      school_id: teacher1?.school_id,
      teacher_id: teacher1?._id,
      coordinator_id: coordinator?._id,
    });
    const teacherCoordinator2 = await TeacherCoordinatorModel.create({
      school_id: teacher2?.school_id,
      teacher_id: teacher2?._id,
      coordinator_id: coordinator?._id,
    });

    /* FIND TEACHER_COORDINATOR */
    // const teacherCoordinator = (await TeacherCoordinatorModel.find()).at(0);

    /* CREATE FIELD */
    // const school = (await SchoolModel.find()).at(0);
    const newField1 = school
      ? { ...entities.fields[0], school_id: school._id }
      : null;
    const field1 = await FieldModel.create(newField1);
    const newField2 = school
      ? { ...entities.fields[1], school_id: school._id }
      : null;
    const field2 = await FieldModel.create(newField2);

    /* FIND FIELD */
    // const field = (await FieldModel.find()).at(0);

    /* CREATE TEACHER_FIELD */
    // const teacher = (await TeacherModel.find()).at(0);
    // const field = (await FieldModel.find()).at(0);
    const teacherField1 = await TeacherFieldModel.create({
      school_id: teacher1?.school_id,
      teacher_id: teacher1?._id,
      field_id: field1?._id,
    });
    const teacherField2 = await TeacherFieldModel.create({
      school_id: teacher2?.school_id,
      teacher_id: teacher2?._id,
      field_id: field2?._id,
    });

    /* FIND TEACHER_FIELD */
    // const teacherField = (await TeacherFieldModel.find()).at(0);

    /* CREATE SCHEDULE */
    // const school = (await SchoolModel.find()).at(0);
    const newSchedule1 = school
      ? { ...entities.schedules[0], school_id: school._id }
      : null;
    const schedule1 = await ScheduleModel.create(newSchedule1);

    /* FIND SCHEDULE */
    // const schedule = (await ScheduleModel.find()).at(0);

    /* CREATE BREAK */
    // const schedule = (await ScheduleModel.find()).at(0);
    const newBreak1 = schedule1
      ? {
          ...entities.breaks[0],
          school_id: schedule1?.school_id,
          schedule_id: schedule1?._id,
        }
      : null;
    const breakInstance1 = await BreakModel.create(newBreak1);
    const newBreak2 = schedule1
      ? {
          ...entities.breaks[1],
          school_id: schedule1?.school_id,
          schedule_id: schedule1?._id,
        }
      : null;
    const breakInstance2 = await BreakModel.create(newBreak2);

    /* FIND BREAK */
    // const breakInstance = (await BreakModel.find()).at(0);

    /* CREATE LEVEL */
    // const schedule = (await ScheduleModel.find()).at(0);
    const newLevel1 = schedule1
      ? {
          ...entities.levels[0],
          school_id: schedule1?.school_id,
          schedule_id: schedule1?._id,
        }
      : null;
    const level1 = await LevelModel.create(newLevel1);
    const newLevel2 = schedule1
      ? {
          ...entities.levels[1],
          school_id: schedule1?.school_id,
          schedule_id: schedule1?._id,
        }
      : null;
    const level2 = await LevelModel.create(newLevel2);

    /* FIND LEVEL */
    // const level = (await LevelModel.find()).at(0);

    /* CREATE GROUP */
    // const level = (await LevelModel.find()).at(0);
    // const coordinator = (await UserModel.find()).at(0);
    const newGroup1 = level1
      ? {
          ...entities.groups[0],
          school_id: level1?.school_id,
          level_id: level1?._id,
        }
      : null;
    const group1 = await GroupModel.create(newGroup1);
    const newGroup2 = level2
      ? {
          ...entities.groups[1],
          school_id: level2?.school_id,
          level_id: level2?._id,
        }
      : null;
    const group2 = await GroupModel.create(newGroup2);

    /* FIND GROUP */
    // const group = (await GroupModel.find()).at(0);

    /* CREATE GROUP_COORDINATOR */
    // const group = (await GroupModel.find()).at(0);
    // const coordinator = (await UserModel.find()).at(0);
    const groupCoordinator1 = await GroupCoordinatorModel.create({
      school_id: group1?.school_id,
      group_id: group1?._id,
      coordinator_id: coordinator?._id,
    });
    const groupCoordinator2 = await GroupCoordinatorModel.create({
      school_id: group2?.school_id,
      group_id: group2?._id,
      coordinator_id: coordinator?._id,
    });

    /* FIND GROUP_COORDINATOR */
    // const groupCoordinator = (await GroupCoordinatorModel.find()).at(0);

    /* CREATE SUBJECT */
    // const level = (await LevelModel.find()).at(0);
    // const field = (await FieldModel.find()).at(0);
    const newSubject1 = level1
      ? {
          ...entities.subjects[0],
          school_id: level1?.school_id,
          level_id: level1?._id,
          field_id: field1?._id,
        }
      : null;
    const subject1 = await SubjectModel.create(newSubject1);
    const newSubject2 = level2
      ? {
          ...entities.subjects[1],
          school_id: level2?.school_id,
          level_id: level2?._id,
          field_id: field2?._id,
        }
      : null;
    const subject2 = await SubjectModel.create(newSubject2);

    /* FIND SUBJECT */
    // const subject = (await SubjectModel.find()).at(0);

    /* CREATE SESSION */
    // const level = (await LevelModel.find()).at(0);
    // const group = (await GroupModel.find()).at(0);
    // const subject = (await SubjectModel.find()).at(0);
    // const teacherField = (await TeacherFieldModel.find()).at(0);
    const newSession1 = level1
      ? {
          ...entities.sessions[0],
          school_id: level1?.school_id,
          level_id: level1?._id,
          group_id: group1?._id,
          groupCoordinator_id: groupCoordinator1?._id,
          teacherCoordinator_id: teacherCoordinator1?._id,
          teacherField_id: teacherField1?._id,
          subject_id: subject1?._id,
        }
      : null;
    const sessionInstance1 = await SessionModel.create(newSession1);
    const newSession2 = level2
      ? {
          ...entities.sessions[1],
          school_id: level2?.school_id,
          level_id: level2?._id,
          group_id: group2?._id,
          groupCoordinator_id: groupCoordinator2?._id,
          teacherCoordinator_id: teacherCoordinator2?._id,
          teacherField_id: teacherField2?._id,
          subject_id: subject2?._id,
        }
      : null;
    const sessionInstance2 = await SessionModel.create(newSession2);

    /* FIND SESSION */
    // const sessionInstance = (await SessionModel.find()).at(0);

    // console.log(coordinator);
    console.log("Success populating the database!");
    // stops the execution, 0 = no error
    // process.exit(0);
  } catch (error) {
    console.log(error);
    // stops the execution, 1 = error
    process.exit(1);
  }
};

export const flush = async () => {
  try {
    await connectDB();
    /* DELETE ALL */
    await SchoolModel.deleteMany();
    await UserModel.deleteMany();
    await TeacherModel.deleteMany();
    await FieldModel.deleteMany();
    await TeacherCoordinatorModel.deleteMany();
    await TeacherFieldModel.deleteMany();
    await ScheduleModel.deleteMany();
    await BreakModel.deleteMany();
    await LevelModel.deleteMany();
    await GroupModel.deleteMany();
    await GroupCoordinatorModel.deleteMany();
    await SubjectModel.deleteMany();
    await SessionModel.deleteMany();

    console.log("Success flushing the database!");
    // stops the execution, 0 = no error
    // process.exit(0);
  } catch (error) {
    console.log(error);
    // stops the execution, 1 = error
    process.exit(1);
  }
};
