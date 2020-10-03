<?php
namespace SVB\CBS\ShippingWorldBundle\Model;
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 21.09.15
 * Time: 17:05
 */
interface VillageInterface
{

    /**
     * @return string
     */
    public function getName();

    /**
     * @return IslandInterface
     */
    public function getIsland();

    /**
     * @param $bookTitle
     * @return BookInterface
     */
    public function getLibraryBook($bookTitle);

    /**
     * @return LibrarianInterface
     */
    public function getLibrarian();

    /**
     * @return int
     */
    public function getCorner();

    /**
     * @return array
     */
    public function export();

}