/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import moment from "moment";
import NewsItem from "./NewsItem";
import DateHeader from "./DateHeader";
import { getStories } from "../utils/api";
import { useStateContext } from "../state";
import { StoreDateFormat } from "../constants";
import Loading from "./Loading";
import Divider from "./Divider";
import Error from "./Error";
import { Color } from "../utils/css-vars";
import StickyHeader from "./StickyHeader";
import LeftSidebar from "./LeftSidebar";
import { useWindowSize, useMultipleRefs } from "../utils/hooks";

function NewsList() {
  const {
    isLoading,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    "storiesByDate",
    async ({ pageParam }) => {
      const { date, startTime, endTime } = pageParam || {
        date: moment(),
        startTime: moment().startOf("date").unix(),
        endTime: moment().endOf("date").unix(),
      };
      const stories = await getStories(startTime, endTime);
      return { date, startTime, endTime, stories };
    },
    {
      getNextPageParam: (lastStoriesByDate, allStoriesByDate) => {
        // Restrict: not more than 100 days
        if (lastStoriesByDate && allStoriesByDate?.length < 100) {
          const lastDate = lastStoriesByDate.date;
          const previousDate = moment(lastDate).subtract(1, "days");
          return {
            date: previousDate,
            startTime: previousDate.startOf("date").unix(),
            endTime: previousDate.endOf("date").unix(),
          };
        }
      },
    }
  );

  const storiesByDates = data?.pages ?? [];

  const parentRef = useRef();
  const { top: topFilter, stickyHeader, refreshKey } = useStateContext();
  const top = parseInt(topFilter);
  const { width } = useWindowSize();
  const [getRefs, setRef] = useMultipleRefs();

  const rowVirtualizer = useVirtualizer({
    count: storiesByDates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      if (storiesByDates.length) {
        let total = 150; // padding and date row
        const minItemHeight = 37; // other elements
        const items = storiesByDates[index];
        items.stories.slice(0, top).forEach(({ title }) => {
          // finding number of lines by title's length is rough
          // accurate size is not required here
          let charLen = title.length;
          if (width <= 500) {
            charLen = 25;
          } else if (width <= 900) {
            charLen = 50;
          }
          const titleLines = Math.round(title.length / charLen);
          const titleHeight = titleLines * 22;
          const itemHeight = titleHeight + minItemHeight;
          total += itemHeight;
        });
        return total;
      }
    },
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [width, rowVirtualizer]);

  const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

  useEffect(() => {
    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= storiesByDates.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    lastItem,
    hasNextPage,
    fetchNextPage,
    storiesByDates.length,
    isFetchingNextPage,
  ]);

  return (
    <main
      ref={parentRef}
      css={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        justifyContent: "center",
        borderTop: `1rem solid ${Color.darkBlue}`,
        borderBottom: `1rem solid ${Color.darkBlue}`,
      }}
      onScroll={() => {
        for (const ref of getRefs()) {
          ref.current?.onScroll();
        }
      }}
    >
      <LeftSidebar />
      <div
        css={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "800px",
          marginLeft: "50px",
          marginRight: "auto",
          position: "relative",

          "@media (max-width: 1200px)": {
            margin: "0 20px",
          },

          "@media (max-width: 900px)": {
            width: "100%",
          },

          "@media (max-width: 500px)": {
            margin: "0 5px",
          },
        }}
        key={refreshKey || top} // remount on filter change is required because rowVirtualizer.measure() is not quite working
      >
        {!storiesByDates.length && isLoading && <Loading />}
        {!storiesByDates.length && isError && <Error />}
        {stickyHeader && <StickyHeader title={stickyHeader} />}
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const { date, stories } = storiesByDates.length
            ? storiesByDates[virtualRow.index]
            : {};
          return (
            <div
              key={virtualRow.index}
              ref={virtualRow.measureElement}
              css={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "max-content",
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: "50px",
              }}
            >
              <DateHeader date={date} ref={setRef(virtualRow.index)} />
              {stories.slice(0, top).map((story, index) => (
                <NewsItem
                  rank={index + 1}
                  {...story}
                  key={story.id}
                  displayDate={moment(date).format(StoreDateFormat)}
                />
              ))}
            </div>
          );
        })}
        {!storiesByDates.length || hasNextPage ? (
          isFetchingNextPage &&
          !isError && (
            <Loading
              style={{
                position: "absolute",
                width: "100%",
                transform: `translateY(${lastItem?.end}px)`,
              }}
            />
          )
        ) : (
          <Divider
            message="Wow, you've come a long way!"
            style={{
              fontSize: "0.9rem",
              position: "absolute",
              width: "100%",
              transform: `translateY(${lastItem?.end}px)`,
            }}
          />
        )}
        {isFetchingNextPage && isError && (
          <Divider
            message="Brewer has stopped pumping!"
            style={{
              fontSize: "0.9rem",
              position: "absolute",
              width: "100%",
              transform: `translateY(${lastItem?.end}px)`,
            }}
          />
        )}
      </div>
    </main>
  );
}

export default NewsList;
