CREATE TYPE sex AS ENUM ('male', 'female');
ALTER TABLE hedgehog
    ADD COLUMN name text,
    ADD COLUMN age smallint,
    ADD COLUMN sex sex,
    ADD COLUMN location Point;
